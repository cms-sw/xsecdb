import React from 'react';
import PropTypes from 'prop-types';
//How many pages are shown next to current page
const M = 2;
//Selections of page size
const pageSizes = [10, 20, 30, 40, 50]
const preventDefault = e => e.preventDefault();

export default class Pagination extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="col-lg-9 col-md-8 col-xs-7">
                    <ul className="pagination" style={{ margin: 0 }}>
                        {
                            this.props.pageSize !== 0 &&
                            this.renderNavigation()
                        }
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
                            {this.renderPageSizeSelect()}
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

        let result = [];

        let prevHandler = this.onCurrentPageChange.bind(this, currentPage - 1);
        let nextHandler = this.onCurrentPageChange.bind(this, currentPage + 1);

        const notNext = (recordCount < recordsPerPage);
        const notPrev = currentPage < 1;

        if (notNext) {
            nextHandler = preventDefault;
        }

        if (notPrev) {
            prevHandler = preventDefault;
        }

        //<< Previuos
        result.push(<li className={notPrev ? "disabled" : ""} key={-1}>
            <a href="#" aria-label="Previous"
                onClick={prevHandler}
            >
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>)

        //First page
        if (currentPage - M > 0) {
            result.push(<li key={-2}>
                <a href="#" onClick={this.onCurrentPageChange.bind(this, 0)}>0</a>
            </li>)
        }
        //...
        if (currentPage - M > 1) {
            result.push(<li className="disabled" key={-3}><a href="#">...</a></li>)
        }

        //M pages before current page
        for (let i = currentPage - M; i < currentPage; i++) {
            if (i >= 0) {
                result.push(<li key={i}>
                    <a href="#" onClick={this.onCurrentPageChange.bind(this, i)}>{i}</a>
                </li>)
            }
        }

        //Current page
        result.push(<li className={"active"} key={-4}>
            <a href="#" onClick={preventDefault}>{currentPage}</a>
        </li>);

        //Next (>>)
        result.push(<li key={-5} className={notNext ? "disabled" : ""}>
            <a href="#" aria-label="Next" onClick={nextHandler} aria-disabled={true}>
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>)

        return result;
    }

    renderPageSizeSelect() {
        const result = [];

        //Add "custom" page size selection option (from url parameter)
        if(!pageSizes.includes(this.props.pageSize) && this.props.pageSize !== 0){
            pageSizes.push(this.props.pageSize)
        }

        result.push(<option value={0} key={-1}>All</option>);

        pageSizes.map((pageSizeValue, i) => {
            result.push(<option value={pageSizeValue} key={i}>{pageSizeValue}</option>)
        });        

        return result;        
    }

    onCurrentPageChange(pageNumber, e) {
        e.preventDefault();
        this.props.onChangePagination(pageNumber, this.props.pageSize);
    }

    onPageSizeChange = (e) => {
        const pageSize = e.target.value;
        //To keep current page in boundaries [0:maxPage]
        let currentPage = 0;
        this.props.onChangePagination(currentPage, pageSize);
    }
}

Pagination.propTypes = {
    pageSize: PropTypes.number.isRequired,
    recordCount: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    onChangePagination: PropTypes.func.isRequired
}
