"use client"

import { useState } from "react"
import ImageUpload from "./components/ImageUpload"
import PlantInfo from "./components/PlantInfo"
import { identifyPlant } from "./lib/gemini"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [plantInfo, setPlantInfo] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleImageUpload = async (imageFile: File, previewUrl: string) => {
    setIsLoading(true)
    setError(null)
    setUploadedImage(previewUrl)

    try {
      if (!process.env.NEXT_PUBLIC_GOOGLE_API_KEY) {
        throw new Error("Google API key is not configured")
      }

      const result = await identifyPlant(imageFile)
      setPlantInfo(result)
    } catch (err) {
      console.error("Error identifying plant:", err)
      if (err.message?.includes("API key")) {
        setError("API key error: Please check your Google Gemini API key configuration.")
      } else {
        setError("Failed to identify plant. Please try again with a clearer image.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setPlantInfo(null)
    setUploadedImage(null)
    setError(null)
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24 bg-gradient-to-b from-green-50 to-green-100">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-green-800 text-center">Plant Identifier</h1>
        <p className="text-center text-gray-600 mb-8">
          Upload an image of a plant to identify it and learn more about it
        </p>

        {!plantInfo && !isLoading && <ImageUpload onUpload={handleImageUpload} />}

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
            <p className="text-gray-600">Analyzing your plant image...</p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
            <button
              onClick={handleReset}
              className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {plantInfo && uploadedImage && (
          <div className="mt-6">
            <PlantInfo info={plantInfo} imageUrl={uploadedImage} />
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
              >
                Identify Another Plant
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
