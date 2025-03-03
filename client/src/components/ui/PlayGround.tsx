"use client"
import Editor from "@monaco-editor/react"

type PlayGroundProps = {
  code: string
  onChange: (value: string | undefined) => void
}

export default function PlayGround({ code, onChange }: PlayGroundProps) {
  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      value={code}
      onChange={onChange}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  )
}

