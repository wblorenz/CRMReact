interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export function Pagination(props: PaginationProps) {
    const selectPage = (page: number) => {
        props.onPageChange(page);
    }
    return (
        <div className="form-actions">
            <button type='button' onClick={() => selectPage(props.currentPage - 1)} disabled={props.currentPage===0}>Previous</button>
            <button type='button' disabled>{props.currentPage}</button>
            <button type='button' onClick={() => selectPage(props.currentPage + 1)} disabled={props.currentPage===props.totalPages}> Next</button>
        </div>
    );
}
