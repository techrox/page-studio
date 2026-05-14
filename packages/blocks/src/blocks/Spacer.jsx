// Spacer — explicit vertical whitespace control between blocks.

export const Spacer = {
  label: 'Spacer',
  fields: {
    height: {
      type: 'select',
      label: 'Height',
      options: [
        { label: 'XS (16px)', value: 16 },
        { label: 'S (32px)', value: 32 },
        { label: 'M (56px)', value: 56 },
        { label: 'L (96px)', value: 96 },
        { label: 'XL (140px)', value: 140 },
      ],
    },
  },
  defaultProps: { height: 56 },
  render: ({ height }) => <div aria-hidden style={{ height }} />,
};
