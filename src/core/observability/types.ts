export interface ObservabilityConfig {
  enabled: boolean
  serviceName?: string
  exporter?: 'console' | 'otlp'
  otlpEndpoint?: string
  sampleRate?: number
}
