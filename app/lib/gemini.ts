import { GoogleGenerativeAI } from "@google/generative-ai"

export async function identifyPlant(imageFile: File): Promise<string> {
  try {
    // Check if API key is available
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
    if (!apiKey) {
      throw new Error("API key is not configured")
    }

    // Initialize the API
    const genAI = new GoogleGenerativeAI(apiKey)

    // For text-and-image input, use the gemini-pro-vision model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const imageData = await fileToGenerativePart(imageFile)

    const prompt = `
      Identify this plant from the image and provide detailed information about it.
      
      Please format your response in HTML with the following sections:
      1. <h2>Plant Name</h2> (common name and scientific name)
      2. <h3>Description</h3> (brief description of the plant)
      3. <h3>Care Instructions</h3> (bullet points with <ul> and <li> tags)
      4. <h3>Interesting Facts</h3> (bullet points with <ul> and <li> tags)
      
      If you cannot identify the plant with certainty, please indicate this clearly.
      If the image does not contain a plant, please state that no plant was detected.
    `

    const result = await model.generateContent([prompt, imageData])
    const response = await result.response
    const text = response.text()
    return text
  } catch (error) {
    console.error("Error in identifyPlant:", error)
    throw error
  }
}

async function fileToGenerativePart(file: File) {
  try {
    const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        try {
          const result = reader.result
          if (typeof result === "string") {
            const base64Data = result.split(",")[1]
            resolve(base64Data)
          } else {
            reject(new Error("Failed to convert file to base64"))
          }
        } catch (err) {
          reject(err)
        }
      }
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })

    return {
      inlineData: {
        data: await base64EncodedDataPromise,
        mimeType: file.type,
      },
    }
  } catch (error) {
    console.error("Error in fileToGenerativePart:", error)
    throw error
  }
}
