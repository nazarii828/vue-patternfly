import PfBullseye from "@vue-patternfly/core/src/layouts/Bullseye";

export default {
  title: "Layouts/Bullseye",
  component: PfBullseye,
};

export const Default = (args) => ({
  components: { PfBullseye },
  setup() {
    return { args };
  },
  template: `
    <pf-bullseye v-bind="args">
      Bullseye ◎ layout
    </pf-bullseye>
  `,
});
