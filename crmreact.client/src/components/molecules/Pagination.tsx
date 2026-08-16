interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export function Pagination(props: PaginationProps) {
    const selectPage = (page: number) => {
        props.onPageChange(page);
    };

    const maxPage = Math.max(0, props.totalPages);
    const displayCurrent = props.currentPage + 1;
    const displayTotal = maxPage + 1;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 0.5rem 0.25rem 0.5rem',
            borderTop: '1px solid var(--border-subtle)',
            marginTop: '0.75rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
        }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Showing page <strong style={{ color: 'var(--text-primary)' }}>{displayCurrent}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{displayTotal}</strong>
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                    type='button'
                    className="btn-secondary"
                    onClick={() => selectPage(props.currentPage - 1)}
                    disabled={props.currentPage === 0}
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Previous
                </button>
                <button
                    type='button'
                    className="btn-secondary"
                    onClick={() => selectPage(props.currentPage + 1)}
                    disabled={props.currentPage >= props.totalPages}
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                >
                    Next
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>
        </div>
    );
}
