import { Controller, Sse } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { EventService } from 'src/common/services/event.service';

@Controller('interview')
export class InterviewController {
  constructor(private readonly eventService: EventService) { }

  // SSE 事件流: 实时推送消息
  @Sse('stream')
  stream(): Observable<MessageEvent> {
    return this.eventService.generateTimedEvents().pipe(
      map(message => ({
        data: JSON.stringify({
          message,
          timestamp: new Date().toISOString()
        }),
      } as MessageEvent))
    )
  }
}
