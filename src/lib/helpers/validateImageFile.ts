type configType = {
  size: number,
  acceptedFileTypes: string[] | RegExp[]
}

const defaultConfig: configType = {
  size: 4 * 1024 * 1024,
  acceptedFileTypes: [/image\/*/]
}

type returnType = ({
  verified: true,
  file: File
} | {
  verified: false,
  messages: string[]
})

export default function validateImage(
  file: File, config: configType = defaultConfig
) : returnType {
  const messages: string[] = [];

  // Check if the file is the specified type
  const res = config.acceptedFileTypes.some((type) => file.type.match(type))
  if (!res) messages.push('File type not allowed');

  // Check if the file size is under 2 megabytes
  if (file.size > config.size) messages.push(`File size to large. File size: ${file.size}, max size: ${config.size}`);

  if(messages.length > 0) return { verified: false, messages}
  else return { verified: true, file }
};