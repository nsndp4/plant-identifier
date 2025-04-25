interface PlantInfoProps {
  info: string
  imageUrl: string
}

export default function PlantInfo({ info, imageUrl }: PlantInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3">
          <img src={imageUrl || "/placeholder.svg"} alt="Uploaded plant" className="w-full h-full object-cover" />
        </div>
        <div className="md:w-2/3 p-6">
          <h2 className="text-2xl font-semibold mb-4 text-green-700">Plant Information</h2>
          <div className="prose prose-green max-w-none">
            <div dangerouslySetInnerHTML={{ __html: info }} />
          </div>
        </div>
      </div>
    </div>
  )
}
