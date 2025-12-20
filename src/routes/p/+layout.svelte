<script lang="ts">
	import '$src/app.css';
	import { setContext, onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { children } = $props();

	let pushStatus = $state({
		permission: 'granted'
	});

	setContext('pushStatus', pushStatus);

	onMount(() => {
		if (!browser) return;

		// 초기 상태 설정
		pushStatus.permission = Notification.permission;

		// 권한 변경 모니터링
		if ('permissions' in navigator) {
			navigator.permissions.query({ name: 'notifications' }).then((status) => {
				status.onchange = () => {
					pushStatus.permission = Notification.permission;
				};
			});
		}
	});

	async function togglePush() {
		if (!browser) return;

		if (pushStatus.permission !== 'granted') {
			const permission = await Notification.requestPermission();
			pushStatus.permission = permission; // $state 덕분에 자동으로 UI 업데이트

			if (permission === 'granted') {
				// TODO: Subscription 로직 실행
			}
		}
	}
</script>

<div>
	{#if pushStatus.permission !== 'granted'}
		<button
			type="button"
			onclick={togglePush}
			class="bg-warning text-warning-content
			px-6 py-3.5 top-0 sticky z-10 flex w-full cursor-pointer items-center justify-between"
		>
			<div class="gap-3 flex items-center">
				<span class="h-2 w-2 relative flex">
					<span
						class="animate-ping bg-warning-content absolute inline-flex h-full w-full rounded-full opacity-75"
					></span>
					<span class="h-2 w-2 bg-warning-content relative inline-flex rounded-full"></span>
				</span>
				<p class="font-black tracking-tighter text-[11px] uppercase">
					{pushStatus.permission === 'denied'
						? '알림 권한이 차단됨 (브라우저 설정에서 해제 필요)'
						: '알림 권한이 필요합니다'}
				</p>
				<span class="font-bold text-[10px] underline decoration-2 underline-offset-2">설정하기</span
				>
			</div>
		</button>
	{/if}

	<div class="min-h-100 text-base-content font-sans max-w-3xl mx-auto flex flex-col">
		{@render children()}
	</div>
</div>
