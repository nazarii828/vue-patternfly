<template>
  <doc-page title="Jump links">
    <template #description><b>Jump links</b> allow users to navigate to sections within a page.</template>

    <template #apidocs>
      <component-info src="packages/core/src/components/JumpLinks/JumpLinks.vue" />
      <component-info src="packages/core/src/components/JumpLinks/JumpLinksItem.vue" />
      <component-info src="packages/core/src/components/JumpLinks/JumpLinksList.vue" />
    </template>

    <pre v-md>
      ## Examples

      These examples are static because they have no element to scroll spy on that makes sense.
    </pre>

    <story-canvas title="Basic">
      <pf-jump-links>
        <pf-jump-links-item>Inactive section</pf-jump-links-item>
        <pf-jump-links-item active>Active section</pf-jump-links-item>
        <pf-jump-links-item>Inactive section</pf-jump-links-item>
      </pf-jump-links>
    </story-canvas>
  </doc-page>
</template>
