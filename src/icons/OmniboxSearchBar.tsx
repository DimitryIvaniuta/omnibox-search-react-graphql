// put this above the default export (or export it to a separate file if you prefer)
const SearchHouseIcon = (props: React.SVGProps<SVGSVGElement>)=> {
    return (
        <svg
            width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            {/* house */}
            <path d="M3 11.5L12 4l9 7.5" />
            <path d="M5 10.5V20h6v-5h2v5h6v-9.5" />
            {/* magnifier over roof */}
            <circle cx="16.5" cy="8.5" r="2.25" />
            <line x1="18.2" y1="10.2" x2="20.2" y2="12.2" />
        </svg>
    );
}

export default SearchHouseIcon;