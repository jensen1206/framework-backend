import * as React from "react";
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';

const v5NameSpace = '071330f0-521d-4564-9fbd-6d96dd412b1f';

function TableMultiSelect({
                              multiSelects,
                              selectedMultiple,
                              selectedMultiCategory,
                              onChangeSelected,
                              selectedIds,
                              onExecuteMultipleBtn,
                              suCategorySelect,
                              showGrid,
                              onToggleGridTable
                          }) {
    return (
        <React.Fragment>
            <div className="d-flex flex-wrap align-items-center">

                <div className="d-block me-1">
                    <select
                        id={uuidv5('selectMultiple', v5NameSpace)}
                        aria-label="Multiple Select"
                        disabled={!selectedIds.length}
                        value={selectedMultiple}
                        onChange={(e) => onChangeSelected(e.target.value, 'multiple')}
                        className="form-select form-select-sm no-blur mb-3 me-1">
                        {multiSelects.map((select, index) =>
                            <option value={select.id} key={index}>{select.label}</option>
                        )}
                    </select>
                </div>
                <div className="d-block me-1">
                    <select
                        id={uuidv5('selectCat', v5NameSpace)}
                        disabled={selectedMultiple !== 1 || suCategorySelect.length < 3}
                        value={selectedMultiCategory}
                        onChange={(e) => onChangeSelected(e.target.value, 'multi-cat')}
                        aria-label="Category Select"
                        className="form-select form-select-sm no-blur mb-3 me-1">
                        {suCategorySelect.map((cat, index) =>
                            <option value={cat.id} key={index}>{cat.label}</option>
                        )}
                    </select>
                </div>
                <div className="d-block">
                    <fieldset disabled={selectedMultiple === 1 && !selectedMultiCategory}>
                        <button
                            onClick={onExecuteMultipleBtn}
                            type="button"
                            disabled={!selectedIds.length || !selectedMultiCategory && !selectedMultiple}
                            className={`select-media-action btn btn-sm mb-3 ${selectedIds.length && selectedMultiple === 1 ? 'btn-switch-blue dark' : ''} ${selectedIds.length && selectedMultiple === 2 ? 'btn-danger dark' : ''} ${!selectedIds.length || !selectedMultiCategory && !selectedMultiple ? 'btn-outline-secondary' : ''} `}>
                            <i className="bi bi-caret-right me-1"></i>
                            {trans['medien']['execute']}
                        </button>
                    </fieldset>
                </div>
                <div className="ms-auto">
                    <i onClick={onToggleGridTable}
                        className={`bi bi-list-check d-inline-block fs-5 ms-3 me-2 ${!showGrid ? 'text-blue pe-none' : 'hover-scale cursor-pointer'}`}></i>
                    <i onClick={onToggleGridTable}
                        className={`bi bi-grid  d-inline-block fs-5 ${showGrid ? 'text-blue pe-none' : 'hover-scale cursor-pointer'}`}></i>
                </div>
            </div>
        </React.Fragment>
    );
}

export default TableMultiSelect;