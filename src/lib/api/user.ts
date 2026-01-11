import { PUBLIC_API_URL } from '$lib/config';
import { api } from '$lib/pkg/fetch';
export interface UserInfo {
	user_id: string;
	email?: string;
	terms_agreed: boolean;
}

export async function fetchWhoami(): Promise<UserInfo | null> {
	try {
		const res = await api<UserInfo>(`${PUBLIC_API_URL}/users/whoami`);

		return res;
	} catch (_) {
		return null;
	}
}

export async function agreeToTerms(): Promise<void> {
	await api<void>(`${PUBLIC_API_URL}/users/terms-agree`, {
		method: 'POST'
	});
}
