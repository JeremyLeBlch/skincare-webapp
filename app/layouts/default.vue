<template>
  <div class="flex min-h-screen flex-col bg-bg">
    <TopNav />
    <main class="flex flex-1 flex-col lg:min-h-0">
      <slot />
    </main>
    <BottomNav />
  </div>
</template>
