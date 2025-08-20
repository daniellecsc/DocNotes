import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error("OPENAI_API_KEY is not configured")
      return NextResponse.json(
        { error: "Transcription service is not configured. Please add OPENAI_API_KEY to environment variables." },
        { status: 500 },
      )
    }

    // Parse the form data
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Validate file size (OpenAI has a 25MB limit)
    const maxSize = 25 * 1024 * 1024 // 25MB
    if (audioFile.size > maxSize) {
      return NextResponse.json({ error: "Audio file is too large. Maximum size is 25MB." }, { status: 400 })
    }

    // Prepare the form data for OpenAI API
    const openAIFormData = new FormData()
    openAIFormData.append("file", audioFile)
    openAIFormData.append("model", "whisper-1")
    openAIFormData.append("language", "en") // You can make this configurable
    openAIFormData.append("response_format", "json")

    // Call OpenAI Whisper API
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: openAIFormData,
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("OpenAI API error:", response.status, errorData)

      // Handle specific OpenAI errors
      if (response.status === 401) {
        return NextResponse.json({ error: "Invalid API key. Please check your OpenAI API key." }, { status: 500 })
      } else if (response.status === 429) {
        return NextResponse.json({ error: "Rate limit exceeded. Please try again in a moment." }, { status: 429 })
      } else if (response.status === 413) {
        return NextResponse.json({ error: "Audio file is too large for transcription." }, { status: 400 })
      } else {
        return NextResponse.json({ error: "Transcription failed. Please try again." }, { status: response.status })
      }
    }

    const transcriptionData = await response.json()

    // Return the transcription
    return NextResponse.json({
      transcription: transcriptionData.text || "",
      success: true,
    })
  } catch (error) {
    console.error("Transcription error:", error)

    if (error instanceof Error) {
      // Handle network errors
      if (error.message.includes("fetch")) {
        return NextResponse.json(
          { error: "Network error. Please check your internet connection and try again." },
          { status: 500 },
        )
      }
    }

    return NextResponse.json(
      { error: "An unexpected error occurred during transcription. Please try again." },
      { status: 500 },
    )
  }
}
