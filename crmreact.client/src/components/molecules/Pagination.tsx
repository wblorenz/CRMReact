import styles from './Pagination.module.css';

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
        <div className={styles.pagination}>
            <span className={styles.pageInfo}>
                Showing page <strong>{displayCurrent}</strong> of <strong>{displayTotal}</strong>
            </span>
            <div className={styles.btnGroup}>
                <button
                    type='button'
                    className={`btn-secondary ${styles.navBtn}`}
                    onClick={() => selectPage(props.currentPage - 1)}
                    disabled={props.currentPage === 0}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Previous
                </button>
                <button
                    type='button'
                    className={`btn-secondary ${styles.navBtn}`}
                    onClick={() => selectPage(props.currentPage + 1)}
                    disabled={props.currentPage >= props.totalPages}
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

export default Pagination;
