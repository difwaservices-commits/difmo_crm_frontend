import React from "react";

const Filter = ({ search, setSearch, phase, setPhase }) => {
    return (
        <div className=" rounded-xl p-4 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">

            {/* Search */}
            <div className="w-full md:w-1/2">
                <label className="text-sm text-blue-500 font-medium">Search Project</label>
                <input
                    type="text"
                    placeholder="Search by project name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {/* Phase Filter */}
            <div className="w-full md:w-1/3">
                <label className="text-sm text-blue-500 font-medium">Filter by Phase</label>
                <select
                    value={phase}
                    onChange={(e) => setPhase(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value="">All Phases</option>
                    <option value="Planning">Planning</option>
                    <option value="Development">Development</option>
                    <option value="Testing">Testing</option>
                    <option value="Deployment">Deployment</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>

            {/* Clear button */}
            <div className="w-full md:w-auto flex items-end mt-5">
                <button
                    onClick={() => {
                        setSearch("");
                        setPhase("");
                    }}
                    className="px-4 py-2 bg-blue-500  text-sm font-medium transition text-white rounded"
                >
                    Clear Filters
                </button>
            </div>

        </div>
    );
};

export default Filter;
