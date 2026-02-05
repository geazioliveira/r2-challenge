import {
  type Span,
  SpanStatusCode,
  trace,
  type Tracer,
} from '@opentelemetry/api'
import type { ObservabilityConfig } from './types'

export class ObservabilityManager {
  private static instance: ObservabilityManager
  private tracer: Tracer | null = null
  private config: ObservabilityConfig = { enabled: false }
  private initialized = false

  private constructor() {}

  static getInstance(): ObservabilityManager {
    if (!ObservabilityManager.instance) {
      ObservabilityManager.instance = new ObservabilityManager()
    }
    return ObservabilityManager.instance
  }

  async init(config: ObservabilityConfig): Promise<void> {
    this.config = config
    if (!this.config.enabled) return

    try {
      await this.initializeSDK()
      this.initialized = true
      this.tracer = trace.getTracer('r2-stocks-widget')
      console.log('Observability initialized')
    } catch (error) {
      console.error('Failed to initialize observability:', error)
    }
  }

  startSpan(name: string, options?: any): Span | undefined {
    if (!this.initialized || !this.tracer) return undefined
    return this.tracer.startSpan(name, options)
  }

  withSpan<T>(name: string, fn: (span: Span) => T): T {
    if (!this.initialized || !this.tracer) {
      return trace.getTracer('default').startActiveSpan(name, (span) => {
        try {
          return fn(span)
        } finally {
          span.end()
        }
      })
    }

    return this.tracer.startActiveSpan(name, (span) => {
      try {
        return fn(span)
      } catch (error) {
        span.recordException(error as any)
        span.setStatus({ code: SpanStatusCode.ERROR })
        throw error
      } finally {
        span.end()
      }
    })
  }

  private async initializeSDK() {
    const { WebTracerProvider } = await import('@opentelemetry/sdk-trace-web')
    const { SimpleSpanProcessor, BatchSpanProcessor, ConsoleSpanExporter } =
      await import('@opentelemetry/sdk-trace-base')
    const resourcesModule = (await import('@opentelemetry/resources')) as any
    const Resource =
      resourcesModule.default || resourcesModule.default?.Resource
    const semanticConventionsModule =
      (await import('@opentelemetry/semantic-conventions')) as any
    const SemanticResourceAttributes =
      semanticConventionsModule.SemanticResourceAttributes ||
      semanticConventionsModule.default?.SemanticResourceAttributes

    console.log(resourcesModule)
    const resource = new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]:
        this.config.serviceName || 'r2-stocks-widget',
    })

    const provider: any = new WebTracerProvider({ resource })

    // Configure Exporter
    if (this.config.exporter === 'otlp' && this.config.otlpEndpoint) {
      const { OTLPTraceExporter } =
        await import('@opentelemetry/exporter-trace-otlp-http')
      const exporter = new OTLPTraceExporter({
        url: this.config.otlpEndpoint,
      })
      provider.addSpanProcessor(new BatchSpanProcessor(exporter))
    } else {
      // Default to Console
      provider.addSpanProcessor(
        new SimpleSpanProcessor(new ConsoleSpanExporter()),
      )
    }

    provider.register()
  }
}
