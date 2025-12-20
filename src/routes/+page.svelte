<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Bell, BellOff } from 'lucide-svelte';
	import { push } from '$lib/client/pushManager.svelte'; // 로직 임포트
</script>

<div class="p-8 max-w-xl container mx-auto">
	<Card>
		<CardHeader>
			<CardTitle class="gap-2 flex items-center">🔔 Push Notification</CardTitle>
			<CardDescription>PWA 푸시 알림 테스트 (Managed)</CardDescription>
		</CardHeader>

		<CardContent class="space-y-4">
			{#if push.statusMsg}
				<div
					class="rounded p-3 text-sm
                    {push.statusType === 'success' ? 'bg-green-100 text-green-800' : ''}
                    {push.statusType === 'error' ? 'bg-red-100 text-red-800' : ''}
                    {push.statusType === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}"
				>
					{push.statusMsg}
				</div>
			{/if}

			<div class="gap-3 flex items-center">
				{#if push.isSubscribed}
					<BellOff class="w-6 h-6 text-green-500" />
					<span class="text-sm font-medium">알림 구독 중</span>
				{:else}
					<Bell class="w-6 h-6 text-gray-400" />
					<span class="text-sm text-muted-foreground">알림 미구독</span>
				{/if}
			</div>

			<div class="gap-2 flex flex-col">
				{#if !push.isSubscribed}
					<Button onclick={() => push.handleSubscribe()}>알림 구독하기</Button>
				{:else}
					<Button variant="outline" onclick={() => push.testNotification()}>테스트 알림</Button>

					<Button variant="destructive" onclick={() => push.handleUnsubscribe()}>구독 해제</Button>
				{/if}
			</div>

			{#if push.subscription}
				<pre class="text-xs bg-muted p-3 rounded max-h-64 mt-4 overflow-auto">
                    {JSON.stringify(push.subscription, null, 2)}
                </pre>
			{/if}
		</CardContent>
	</Card>
</div>
