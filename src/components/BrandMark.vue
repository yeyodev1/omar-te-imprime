<template>
  <span class="mark" aria-hidden="true">
    <span class="mark__o" />
    <span class="mark__m">M<i /></span>
  </span>
</template>

<style scoped lang="scss">
.mark {
  display: inline-flex;
  align-items: center;
  gap: 0.06em;
  font-family: $font-display;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.06em;

  &__o {
    width: 0.78em;
    height: 0.78em;
    border-radius: 50%;
    border: 0.2em solid currentColor;
  }

  &__m {
    position: relative;
    i {
      position: absolute;
      right: -0.02em;
      top: -0.16em;
      width: 0.17em;
      height: 0.17em;
      background: $lime;
    }
  }
}
</style>
