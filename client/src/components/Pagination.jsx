import React from 'react';

const M = 2;
const preventDefault = e => e.preventDefault();

export default class Pagination extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentPage: props.currentPage,
            pageSize: props.pageSize
        }

        this.onPageSizeChange = this.onPageSizeChange.bind(this);
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-9 col-md-8 col-xs-7">
                    <ul className="pagination" style={{ margin: 0 }}>
                        {this.renderNavigation()}
                    </ul>
                </div>
                <div className="col-lg-3 col-md-4 col-xs-5 form-group" >
                    <div className="col-xs-5">
                        <label className="control-label" htmlFor="for">Page size</label>
                    </div>
                    <div className="col-xs-7">
                        <select className="form-control selectpicker" value={this.state.pageSize}
                            onChange={this.onPageSizeChange}
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                            <option value={40}>40</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
            </div>
        )
    }

    renderNavigation() {
        const recordCount = this.props.recordCount;
        const recordsPerPage = this.state.pageSize;
        const currentPage = this.state.currentPage;

        const pageCount = Math.ceil(recordCount / recordsPerPage);

        let result = [];

        let prevHandler = this.onCurrentPageChange.bind(this, currentPage - 1);
        let nextHandler = this.onCurrentPageChange.bind(this, currentPage + 1);
        
        if(currentPage >= pageCount){
            nextHandler = preventDefault;
        }

        if(currentPage <= 1){
            prevHandler = preventDefault;
        }

        //<< Previuos
        result.push(<li className={currentPage > 1 ? "" : "disabled"} key={-2}>
            <a href="#" aria-label="Previous"
                onClick={prevHandler}
            >
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>)

        //First page
        if (currentPage - M > 1) {
            result.push(<li key={-1}>
                <a href="#" onClick={this.onCurrentPageChange.bind(this, 1)}>1</a>
            </li>)
        }
        //...
        if (currentPage - M > 2) {
            result.push(<li className="disabled" key={0}><a href="#">...</a></li>)
        }

        //M pages on each side of current page
        for (let i = currentPage - M; i <= currentPage + M; i++) {
            if (i > 0 && i <= pageCount) {
                result.push(<li className={i == currentPage ? "active" : ""} key={i}>
                    <a href="#" onClick={this.onCurrentPageChange.bind(this, i)}>{i}</a>
                </li>)
            }
        }

        //...
        if (currentPage + M < pageCount - 1) {
            result.push(<li key={pageCount + 1} className="disabled" ><a href="#">...</a></li>)
        }
        //LastPage
        if (currentPage + M < pageCount) {
            result.push(<li key={pageCount + 2}>
                <a href="#" onClick={this.onCurrentPageChange.bind(this, pageCount)}>{pageCount}</a>
            </li>)
        }
        //Next >>
        result.push(<li key={pageCount + 3} className={currentPage < pageCount ? "" : "disabled"}>
            <a href="#" aria-label="Next" onClick={nextHandler} aria-disabled={true}>
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>)

        return result;
    }

    onCurrentPageChange(pageNumber, e) {
        e.preventDefault();
        this.setState({
            currentPage: pageNumber
        })

        this.props.onChangePagination(pageNumber, this.state.pageSize);
    }

    onPageSizeChange(e){
        const pageSize = e.target.value;
        //To keep current page in boundaries [1:maxPage]
        const maxPage = Math.ceil(this.props.recordCount / pageSize);
        let currentPage = this.state.currentPage;

        if(this.state.currentPage > maxPage){
            currentPage = maxPage;
        }

        this.setState({
            pageSize,
            currentPage
        })

        this.props.onChangePagination(currentPage, pageSize);
    }
}

