import {PfStack, PfStackItem} from "@vue-patternfly/core/src/layouts/Stack";

export default {
  title: "Layouts/Stack",
  component: PfStack,
  subcomponents: {PfStackItem},
};

const Template = (args) => ({
  components: { PfStack, PfStackItem },
  setup() {
    return { args };
  },
  template: `
    <pf-stack v-bind="args" style="height: 300px">
      <pf-stack-item>content</pf-stack-item>
      <pf-stack-item filled>
        pf-m-fill
      </pf-stack-item>
      <pf-stack-item>content</pf-stack-item>
    </pf-stack>
  `,
});

export const Default = Template.bind({});
Default.args = {
  gutter: true,
};
