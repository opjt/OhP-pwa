import { writable, type Readable } from 'svelte/store';
import { browser } from '$app/environment';
import { fetchWhoami, type UserInfo } from '$lib/api/user';

// 1. 상태 타입 정의
type AuthState = UserInfo | null | undefined;

// 2. 스토어 전용 타입 정의 (Readable의 형식을 확실히 포함)
type AuthStore = {
	subscribe: Readable<AuthState>['subscribe']; // Readable의 subscribe 함수 타입을 그대로 가져옴
	init: () => Promise<void>;
	logout: () => void;
};

function createAuthStore(): AuthStore {
	// 실제 스토어 생성
	const { subscribe, set } = writable<AuthState>(undefined);

	return {
		subscribe, // 이제 여기서 'subscribe' 속성이 확실히 인식됩니다.

		init: async () => {
			if (!browser) return;

			try {
				const res = await fetchWhoami();
				set(res);
			} catch (err) {
				console.error('Auth Init Error:', err);
				set(null);
			}
		},

		logout: () => {
			set(null);
			// SPA라면 로그아웃 후 메인으로 이동하는 로직을 넣기도 함
			// if (browser) window.location.href = '/';
		}
	};
}

export const auth = createAuthStore();
