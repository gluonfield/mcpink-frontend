export interface McpClient {
  id: string
  name: string
  icon: string
}

export const MCP_CLIENTS: McpClient[] = [
  { id: 'claude-code', name: 'Claude Code', icon: '/icons/mcp-clients/claude-dark-icon.svg' },
  { id: 'codex', name: 'Codex', icon: '/icons/mcp-clients/openai-dark-icon.svg' },
  { id: 'gemini-cli', name: 'Gemini CLI', icon: '/icons/mcp-clients/gemini-cli-dark-icon.svg' },
  { id: 'cursor', name: 'Cursor', icon: '/icons/mcp-clients/cursor-dark-icon.svg' },
  { id: 'vscode', name: 'VS Code', icon: '/icons/mcp-clients/vscode-dark-icon.svg' },
  { id: 'windsurf', name: 'Windsurf', icon: '/icons/mcp-clients/windsurf-dark-icon.svg' },
  { id: 'goose', name: 'Goose', icon: '/icons/mcp-clients/goose-dark-icon.svg' },
  { id: 'factory', name: 'Factory', icon: '/icons/mcp-clients/factory-dark-icon.svg' },
  { id: 'opencode', name: 'OpenCode', icon: '/icons/mcp-clients/opencode-dark-icon.svg' }
]
