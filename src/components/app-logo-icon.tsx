import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 256 256"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g fill="currentColor">
                <rect x="110" y="12" width="33" height="33" />
                <rect x="61" y="61" width="33" height="33" />
                <rect x="159" y="61" width="33" height="33" />
                <rect x="12" y="110" width="33" height="33" />
                <rect x="61" y="110" width="33" height="33" />
                <rect x="110" y="110" width="33" height="33" />
                <rect x="159" y="110" width="33" height="33" />
                <rect x="208" y="110" width="33" height="33" />
                <rect x="12" y="159" width="33" height="33" />
                <rect x="208" y="159" width="33" height="33" />
                <rect x="12" y="208" width="33" height="33" />
                <rect x="208" y="208" width="33" height="33" />
            </g>
        </svg>
    );
}
