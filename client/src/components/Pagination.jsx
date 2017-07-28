import React from 'react';

const M = 2;
const preventDefault = e => e.preventDefault();

export default class Pagination extends React.Component {
    constructor(props){
        super(props);
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
                        <select className="form-control selectpicker" value={this.props.pageSize}
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
        const recordsPerPage = this.props.pageSize;
        const currentPage = this.props.currentPage;

        const pageCount = Math.ceil(recordCount / recordsPerPage);

        let result = [];

        let prevHandler = this.onCurrentPageChange.bind(this, currentPage - 1);
        let nextHandler = this.onCurrentPageChange.bind(this, currentPage + 1);
        
        if(recordCount < recordsPerPage){
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
        if (currentPage - M > 0) {
            result.push(<li key={-1}>
                <a href="#" onClick={this.onCurrentPageChange.bind(this, 0)}>0</a>
            </li>)
        }
        //...
        if (currentPage - M > 1) {
            result.push(<li className="disabled" key={0}><a href="#">...</a></li>)
        }

        // //M pages before current page
        for (let i = currentPage - M; i <= currentPage; i++) {
            if (i >= 0) {
                result.push(<li className={i == currentPage ? "active" : ""} key={i}>
                    <a href="#" onClick={this.onCurrentPageChange.bind(this, i)}>{i}</a>
                </li>)
            }
        }
        //Next >>
        result.push(<li key={recordCount + 3} className={recordCount < recordsPerPage ? "disabled" : ""}>
            <a href="#" aria-label="Next" onClick={nextHandler} aria-disabled={true}>
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>)

        return result;
    }

    onCurrentPageChange(pageNumber, e) {
        e.preventDefault();
        this.props.onChangePagination(pageNumber, this.props.pageSize);
    }

    onPageSizeChange(e){
        const pageSize = e.target.value;
        //To keep current page in boundaries [0:maxPage]
        let currentPage = 0;

        this.props.onChangePagination(currentPage, pageSize);
    }
}

