import { Injectable } from "@nestjs/common";
import { interval, map, Observable, Subject, tap } from "rxjs";

@Injectable()
export class EventService {
  private eventSubject = new Subject<string>();

  // 发送事件
  emit(message:string) {
    this.eventSubject.next(message);
  }
  //获取事件流的Observable
  getEvents():Observable<string> {
    return this.eventSubject.asObservable();
  } 

  // 生成一个定时推送事件的方法
  generateTimedEvents(): Observable<string>{
    return interval(5000).pipe(
      map(count => `这是第${count + 1}条定时事件`),
      tap(message => {
        console.log(`推送消息: ${message}`);
      })
    )
  }
}