import { Link, type LinkProps } from '@remix-run/react';
import React, { type PropsWithChildren } from 'react';
import { X } from 'react-feather';
import { match } from 'ts-pattern';

import { getTextCn } from './text';
import { Colors } from '../colors';
import { cx } from '../utils/cx';

export type PillProps = Pick<
  React.HTMLProps<HTMLElement>,
  'children' | 'className'
> & {
  color:
    | 'amber-100'
    | 'blue-100'
    | 'cyan-100'
    | 'gold-100'
    | 'gray-100'
    | 'green-100'
    | 'lime-100'
    | 'orange-100'
    | 'pink-100'
    | 'purple-100'
    | 'red-100'
    | 'success';

  onCloseHref?: LinkProps['to'];

  to?: LinkProps['to'];
};

export const Pill = ({
  children,
  className,
  color,
  onCloseHref,
  to,
}: PillProps) => {
  const body = (
    <span
      className={cx(
        getTextCn({ variant: 'sm' }),
        getPillCn({ color, onCloseHref }),
        className
      )}
      style={getPillStyle(color)}
    >
      {children}{' '}
      {onCloseHref && (
        <Link className="rounded-full hover:bg-gray-100" to={onCloseHref}>
          <X size={16} />
        </Link>
      )}
    </span>
  );

  if (to) {
    return (
      <Link className="hover:underline" to={to}>
        {body}
      </Link>
    );
  }

  return body;
};

function getPillStyle(color: PillProps['color']): React.CSSProperties {
  return match(color)
    .with('amber-100', () => ({ backgroundColor: Colors.Amber50 }))
    .with('blue-100', () => ({ backgroundColor: Colors.CoreBlue10 }))
    .with('cyan-100', () => ({ backgroundColor: Colors.Cyan10 }))
    .with('gold-100', () => ({ backgroundColor: Colors.Yellow10 }))
    .with('gray-100', () => ({ backgroundColor: Colors.Grey200 }))
    .with('green-100', () => ({ backgroundColor: Colors.Green50 }))
    .with('lime-100', () => ({ backgroundColor: Colors.Lime40 }))
    .with('orange-100', () => ({ backgroundColor: Colors.LightOrange50 }))
    .with('pink-100', () => ({ backgroundColor: Colors.Pink10 }))
    .with('purple-100', () => ({ backgroundColor: Colors.Purple30 }))
    .with('red-100', () => ({ backgroundColor: Colors.Red10 }))
    .with('success', () => ({
      backgroundColor: Colors.Green100,
      color: Colors.White,
    }))
    .exhaustive();
}

export function getPillCn({ color, onCloseHref }: Omit<PillProps, 'children'>) {
  return cx(
    'w-max rounded-full px-2 text-sm',

    onCloseHref && 'flex items-center gap-1'
  );
}

Pill.List = function PillList({ children }: PropsWithChildren) {
  return <ul className="flex flex-wrap gap-2">{children}</ul>;
};
