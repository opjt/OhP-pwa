<script lang="ts">
	// import '$src/app.css';
	import { goto } from '$app/navigation';
	import { PUBLIC_VAPID_KEY } from '$env/static/public';
	import { loginWithGithub } from '$lib/client/auth/github-auth';
	import { Play } from 'lucide-svelte';

	const VAPID_PUBLIC_KEY = PUBLIC_VAPID_KEY;

	function handleSubscribe() {
		console.log(VAPID_PUBLIC_KEY);
	}
</script>

<div
	class="mx-auto flex min-h-screen max-w-md flex-col bg-base-100 p-8 font-sans text-base-content"
>
	<div class="flex flex-1 flex-col items-center justify-center text-center">
		<div
			class="mb-8 flex h-20 w-20 items-center justify-center rounded-4xl bg-neutral text-neutral-content shadow-xl"
		>
			<span class="text-3xl font-black italic">OHP</span>
		</div>

		<div class="space-y-3">
			<h1 class="text-3xl font-black tracking-tight">On-demand hook Push</h1>
			<p class="leading-relaxed opacity-70">
				웹훅을 보내고, 폰에서 바로 응답하세요.<br />
				가장 단순한 <span class="font-semibold text-primary">Interactive Push</span> 도구
			</p>
		</div>

		<div class="mt-10 w-full space-y-4">
			<div class="flex items-center justify-between px-1">
				<span class="text-[11px] font-bold tracking-widest uppercase opacity-50">Quick Test</span>
				<span class="badge badge-outline badge-xs text-[9px] font-bold badge-success">READY</span>
			</div>

			<div class="group relative">
				<div class="absolute top-2 left-3 z-10">
					<div class="flex gap-1">
						<span class="h-2 w-2 rounded-full bg-error"></span>
						<span class="h-2 w-2 rounded-full bg-warning"></span>
						<span class="h-2 w-2 rounded-full bg-success"></span>
					</div>
				</div>

				<div
					class="relative overflow-hidden rounded-2xl bg-neutral p-5 pt-7 text-left font-mono text-[13px] text-neutral-content shadow-2xl"
				>
					<span class="text-info">curl</span><span class="">&nbsp;-X POST</span>
					<div class="break-all opacity-90">"https://ohp.io/api/demo" \</div>
					<div>
						-d <span class="text-success">"msg=Hello World!"</span>
					</div>

					<button
						on:click={handleSubscribe}
						class="btn absolute right-3 bottom-3 gap-2 rounded-xl normal-case shadow-lg transition-transform btn-sm btn-primary hover:scale-105"
					>
						<Play size={14} strokeWidth={2} />
						Run
					</button>
				</div>
			</div>

			<p class="text-[11px] opacity-60">Run 버튼을 누르면 push 알림이 발송됩니다.</p>
		</div>

		<div class="mt-12 w-full space-y-3">
			<button
				on:click={loginWithGithub}
				class="btn flex h-14 w-full items-center justify-center gap-3 rounded-2xl border-none transition-all btn-neutral hover:opacity-90"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					fill="currentColor"
					viewBox="0 0 16 16"
				>
					<path
						d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
					/>
				</svg>
				<span class="text-[15px] font-bold">GitHub로 시작하기</span>
			</button>

			<button
				class="btn h-14 w-full rounded-2xl opacity-70 transition-all btn-outline hover:opacity-100"
			>
				<span class="text-[15px] font-semibold">다른 계정으로 로그인</span>
			</button>
		</div>
	</div>

	<footer class="mt-auto py-4 text-center">
		<p class="text-[12px] opacity-40">
			계속 진행함으로써 OhP의 <span class="cursor-pointer underline">이용약관</span>에 동의하게
			됩니다.
		</p>
	</footer>
</div>
