interface Card {
    children: React.ReactNode;
}

export const Card: React.FC<Card> = ({ children }) => {
    return (
        <div className="mt-3 rounded-xl shadow-lg border border-gray-200">
            {children}
        </div>
    )
}

export const HeaderCard: React.FC<Card> = ({ children }) => {
    return (
        <div className="flex flex-wrap items-center justify-between border-b border-gray-200 px-5 py-5">
            {children}
        </div>
    )
}