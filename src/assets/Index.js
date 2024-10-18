export const CloseIcon = ({ width = 14, height = 14, fill = "none", stroke = "#000" }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 14 14"
            fill={fill}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M13 1L1 13"
                stroke={stroke}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M1 1L13 13"
                stroke={stroke}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

