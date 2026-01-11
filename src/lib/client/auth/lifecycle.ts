import { PUBLIC_API_URL } from '$lib/config';
import { api } from '$lib/pkg/fetch';
import { auth } from '$lib/stores/auth';

export async function logout() {
	await api<void>(`${PUBLIC_API_URL}/auth/logout`);
	await auth.init();
}
