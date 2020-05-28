import { debugRoot } from '../../../../styles/debugStyles';
import { ComponentSlotStylesPrepared, ICSSInJSStyle, margin, padding } from '@fluentui/styles';
import { ListStylesProps } from '../../../../components/List/List';

const listStyles: ComponentSlotStylesPrepared<ListStylesProps> = {
  root: ({ props: p }): ICSSInJSStyle => ({
    ...(p.debug && debugRoot()),
    display: p.horizontal ? 'inline-flex' : 'block',
    ...(p.isListTag && {
      listStyle: 'none',
      ...padding('0'),
      ...margin('0'),
    }),
  }),
};

export default listStyles;
