import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  showLoading(): void {
    this.isLoadingSubject.next(true);
  }

  hideLoading(): void {
    this.isLoadingSubject.next(false);
  }

  wrapWithLoading<T>(observable: Observable<T>): Observable<T> {
    this.showLoading();
    return observable.pipe(
      finalize(() => this.hideLoading())
    );
  }
}
