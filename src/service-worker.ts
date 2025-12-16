/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const sw = self as unknown as ServiceWorkerGlobalScope;

// 캐시 이름
const CACHE_NAME = `cache-${version}`;

// 캐시할 파일들 (SvelteKit 빌드 + static 파일)
const ASSETS = [
  ...build,
  ...files
];

// 1. 설치 이벤트 (Install)
sw.addEventListener('install', (event) => {
  console.log('[SW] 서비스 워커 설치 중...');
  
  async function addFilesToCache() {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS);
  }

  event.waitUntil(addFilesToCache());
  
  // 대기 상태 없이 즉시 활성화 
  sw.skipWaiting();
});

// 2. 활성화 이벤트 (Activate)
sw.addEventListener('activate', (event) => {
  console.log('[SW] 서비스 워커 활성화됨');

  async function deleteOldCaches() {
    const keys = await caches.keys();
    for (const key of keys) {
      if (key !== CACHE_NAME) {
        await caches.delete(key);
      }
    }
  }

  event.waitUntil(deleteOldCaches());
  
  // 즉시 클라이언트 제어권 획득 (참고 코드 반영)
  event.waitUntil(sw.clients.claim());
});

// 3. Fetch 이벤트 (SvelteKit 캐시 전략 유지)
sw.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  async function respond() {
    const url = new URL(event.request.url);
    const cache = await caches.open(CACHE_NAME);

    // A. 빌드 파일(ASSETS)은 캐시 우선
    if (ASSETS.includes(url.pathname)) {
      const cachedResponse = await cache.match(url.pathname);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    // B. 그 외 요청은 네트워크 우선 -> 실패 시 캐시
    try {
      const response = await fetch(event.request);

      if (response.status === 200 && url.protocol.startsWith('http')) {
    
        cache.put(event.request, response.clone());
      }

      return response;
    } catch {
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      throw new Error('Network request failed and no cache available');
    }
  }

  event.respondWith(respond());
});

// 4. Push 알림 수신 (기능 강화)
sw.addEventListener('push', (event) => {
  if (!event.data) return;
  

  // 기본 데이터 설정
  let data = {
    title: '새로운 알림',
    body: '내용이 없습니다.',
    icon: '/logo/icon-192x192.png', 
    badge: '/logo/badge-72x72.png',
    
  };

  // 데이터 파싱 (JSON 파싱 실패 대비)
  try {
    const jsonData = event.data.json();
    
    data = { ...data, ...jsonData };
    console.log(data)
  } catch (e) {
    console.log('Push 데이터가 JSON이 아닙니다. 텍스트로 처리합니다.', e);
    data.body = event.data.text();
  }

  const options: NotificationOptions = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    data:  {},
    tag: 'default-tag',
    
  };

  event.waitUntil(
    sw.registration.showNotification(data.title, options)
  );
});

// 5. 알림 클릭 이벤트 (액션 처리 포함)
sw.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // '닫기' 액션 클릭 시 아무 작업 안 함
  if (event.action === 'close') {
    return;
  }

  const targetUrl = event.notification.data.url || '/';

  // 앱 열기 또는 포커스
  event.waitUntil(
    sw.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 1. 이미 열린 창이 있고 URL이 일치하면 포커스
      for (const client of clientList) {
        // base URL이 같은지 확인 (쿼리 파라미터 무시 등 유연하게 처리 가능)
        if (client.url.includes(sw.registration.scope) && 'focus' in client) {
            // 필요하다면 여기서 client.navigate(targetUrl)로 페이지 이동도 가능
            return client.focus();
        }
      }
      // 2. 열린 창이 없으면 새 창 열기
      if (sw.clients.openWindow) {
        return sw.clients.openWindow(targetUrl);
      }
    })
  );
});

interface SyncEvent extends ExtendableEvent {
  tag: string;
  lastChance: boolean;
}
// 백그라운드 동기화 TODO: 백그라운드 동기화 구현
sw.addEventListener('sync', (event) => {
  const syncEvent = event as SyncEvent;
    if (syncEvent.tag === 'sync-notifications') {
        console.log('[SW] 백그라운드 동기화 실행');
        // event.waitUntil(doSomething()); 
    }
});