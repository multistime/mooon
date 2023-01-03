import { decode, encode } from 'base-64'

const owner = 'OldVoyt'
const repo = 'mooon-settings'
const path = 'settings'
const personalAccessTokenEncoded = 'Z2hwX0hiWVBjSmtkZHJ0aGJndXVIQWFBT29GbW1TUW1pNDBBY2JiSA=='
const personalAccessTokenDecoded = () => decode(personalAccessTokenEncoded)
interface ISettingFileContent {
  sha: string
  content: string
}

interface ISettingFileInfo {
  sha: string
  name: string
}

export interface FileSaveResult {
  sha: string
}

export const updateFile = async (fileName: string, newContent: string, sha: string) => {
  const message = 'Update test.json'
  const content = encode(newContent)

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}/${fileName}.json`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${personalAccessTokenDecoded()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ path, message, content, sha })
  })

  return { sha: (await response.json()).sha }
}

export const getFile = async (fileName: string): Promise<ISettingFileContent> => {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}/${fileName}.json`, {
    headers: {
      Authorization: `Bearer ${personalAccessTokenDecoded()}`,
      'Content-Type': 'application/json'
    }
  })

  const file = await response.json()
  return {
    ...file,
    content: decode(file.content)
  }
}

export const createFile = async (fileName: string, content: string): Promise<FileSaveResult> => {
  const message = 'Create ' + fileName
  const encodedContent = encode(content)

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}/${fileName}.json`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${personalAccessTokenDecoded()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ path: `${path}/${fileName}.json`, message, content: encodedContent, branch: 'main' })
  })

  return { sha: (await response.json()).sha }
}

export const getFileList = async (): Promise<ISettingFileInfo[]> => {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    headers: {
      Authorization: `Bearer ${personalAccessTokenDecoded()}`,
      'Content-Type': 'application/json'
    }
  })

  const file = await response.json()
  return file
}