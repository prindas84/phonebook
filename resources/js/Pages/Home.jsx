import { Link, useForm, router } from '@inertiajs/react';

export default function Home({ contacts, sort, direction, search }) {
    const { data, setData } = useForm({
        search: search || '',
    });

    const getNextDirection = (column) => {
        if (sort === column) {
            return direction === 'asc' ? 'desc' : 'asc';
        }
        return 'asc';
    };

    const renderSortIndicator = (column) => {
        if (sort !== column) return '↕︎';
        return direction === 'asc' ? '↑' : '↓';
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();

        router.get(
            route('phone_numbers.index'),
            {
                search: data.search || '',
                sort: sort || 'name',
                direction: direction || 'asc',
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleReset = () => {
        setData('search', '');

        router.get(
            route('phone_numbers.index'),
            {},
            {
                preserveScroll: true,
                preserveState: false,
                replace: true,
            }
        );
    };

    const buildSortLinkProps = (column) => ({
        href: route('phone_numbers.index'),
        data: {
            search: search || '',
            sort: column,
            direction: getNextDirection(column),
        },
        preserveScroll: true,
        preserveState: true,
        replace: true,
    });

    const hasContacts = contacts?.data?.length > 0;

    return (
        <div className="container my-4">
            <h1 className="mb-4">Phone Book</h1>

            {/* Search + Add Record Row */}
            <div className="row g-2 mb-3 align-items-center">
                {/* Search Form */}
                <div className="col-12 col-md-8">
                    <form onSubmit={handleSearchSubmit} className="row g-2">
                        <div className="col-12 col-sm-6 col-md-8">
                            <input
                                type="text"
                                name="search"
                                className="form-control"
                                placeholder="Search Name, Phone, City, State, Postcode..."
                                value={data.search}
                                onChange={(e) => setData('search', e.target.value)}
                            />
                        </div>

                        <div className="col-auto">
                            <button type="submit" className="btn btn-primary">
                                Search
                            </button>
                        </div>
                        <div className="col-auto">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={handleReset}
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                {/* Add Record Button - floats right on desktop, stacks under on mobile */}
                <div className="col-12 col-md-4 text-md-end mt-2 mt-md-0">
                    <Link
                        href={route('phone_numbers.create')}
                        className="btn btn-success w-100 mt-2 w-md-auto"
                    >
                        Add Record
                    </Link>
                </div>

            </div>

            {!hasContacts ? (
                <p>No contacts found.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered phonebook-table">
                        <thead className="table-light">
                            <tr>
                                <th style={{ minWidth: '180px' }}>
                                    <Link
                                        {...buildSortLinkProps('name')}
                                        className="text-decoration-none text-dark"
                                    >
                                        Name&nbsp;{renderSortIndicator('name')}
                                    </Link>
                                </th>
                                <th style={{ minWidth: '140px' }}>
                                    <Link
                                        {...buildSortLinkProps('phone')}
                                        className="text-decoration-none text-dark"
                                    >
                                        Phone&nbsp;{renderSortIndicator('phone')}
                                    </Link>
                                </th>
                                <th style={{ minWidth: '140px' }}>
                                    <Link
                                        {...buildSortLinkProps('city')}
                                        className="text-decoration-none text-dark"
                                    >
                                        City&nbsp;{renderSortIndicator('city')}
                                    </Link>
                                </th>
                                <th style={{ minWidth: '120px' }}>
                                    <Link
                                        {...buildSortLinkProps('state')}
                                        className="text-decoration-none text-dark"
                                    >
                                        State&nbsp;{renderSortIndicator('state')}
                                    </Link>
                                </th>
                                <th style={{ minWidth: '120px' }}>
                                    <Link
                                        {...buildSortLinkProps('postcode')}
                                        className="text-decoration-none text-dark"
                                    >
                                        Postcode&nbsp;{renderSortIndicator('postcode')}
                                    </Link>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.data.map((contact) => {
                                const firstInitial = contact.first_name
                                    ? contact.first_name.charAt(0).toUpperCase()
                                    : '';
                                const displayName = `${contact.surname ?? ''}, ${firstInitial}`.trim();

                                const showUrl = route('phone_numbers.show', contact.id);

                                return (
                                    <tr key={contact.id}>
                                        <td>
                                            <Link
                                                href={showUrl}
                                                className="text-decoration-none text-dark"
                                            >
                                                {displayName}
                                            </Link>
                                        </td>
                                        <td>
                                            <Link
                                                href={showUrl}
                                                className="text-decoration-none text-dark"
                                            >
                                                {contact.phone}
                                            </Link>
                                        </td>
                                        <td>
                                            <Link
                                                href={showUrl}
                                                className="text-decoration-none text-dark"
                                            >
                                                {contact.city}
                                            </Link>
                                        </td>
                                        <td>
                                            <Link
                                                href={showUrl}
                                                className="text-decoration-none text-dark"
                                            >
                                                {contact.state}
                                            </Link>
                                        </td>
                                        <td>
                                            <Link
                                                href={showUrl}
                                                className="text-decoration-none text-dark"
                                            >
                                                {contact.postcode}
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {contacts?.links && contacts.links.length > 1 && (
                <div className="pagination-container">
                    <nav>
                        <ul className="pagination mb-0">
                            {(() => {
                                const links = contacts.links;
                                const max = 5;
                                const currentIndex = links.findIndex(l => l.active);
                                let start = Math.max(currentIndex - 2, 1);
                                let end = Math.min(currentIndex + 2, links.length - 2);

                                if (end - start < max - 1) {
                                    if (start === 1) end = Math.min(start + (max - 1), links.length - 2);
                                    else start = Math.max(end - (max - 1), 1);
                                }

                                const items = [];

                                //
                                // PREVIOUS BUTTON (label replaced with «)
                                //
                                const prevLink = links[0];
                                items.push(
                                    <li key="prev" className={`page-item ${prevLink.url === null ? 'disabled' : ''}`}>
                                        {prevLink.url ? (
                                            <Link
                                                className="page-link"
                                                href={prevLink.url}
                                                preserveScroll
                                                preserveState
                                            >
                                                &laquo;
                                            </Link>
                                        ) : (
                                            <span className="page-link">&laquo;</span>
                                        )}
                                    </li>
                                );

                                //
                                // FIRST PAGE + ELLIPSIS
                                //
                                if (start > 1) {
                                    items.push(
                                        <li key="1" className="page-item">
                                            <Link
                                                className="page-link"
                                                href={links[1].url}
                                                preserveScroll
                                                preserveState
                                                dangerouslySetInnerHTML={{ __html: links[1].label }}
                                            />
                                        </li>
                                    );

                                    if (start > 2) {
                                        items.push(
                                            <li key="dots-start" className="page-item disabled">
                                                <span className="page-link">…</span>
                                            </li>
                                        );
                                    }
                                }

                                //
                                // MIDDLE PAGE BUTTONS
                                //
                                for (let i = start; i <= end; i++) {
                                    const link = links[i];
                                    items.push(
                                        <li key={i} className={`page-item ${link.active ? 'active' : ''}`}>
                                            <Link
                                                className="page-link"
                                                href={link.url}
                                                preserveScroll
                                                preserveState
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        </li>
                                    );
                                }

                                //
                                // LAST PAGE + ELLIPSIS
                                //
                                if (end < links.length - 2) {
                                    if (end < links.length - 3) {
                                        items.push(
                                            <li key="dots-end" className="page-item disabled">
                                                <span className="page-link">…</span>
                                            </li>
                                        );
                                    }

                                    const lastIndex = links.length - 2;
                                    items.push(
                                        <li key={lastIndex} className="page-item">
                                            <Link
                                                className="page-link"
                                                href={links[lastIndex].url}
                                                preserveScroll
                                                preserveState
                                                dangerouslySetInnerHTML={{ __html: links[lastIndex].label }}
                                            />
                                        </li>
                                    );
                                }

                                //
                                // NEXT BUTTON (label replaced with »)
                                //
                                const nextLink = links[links.length - 1];
                                items.push(
                                    <li key="next" className={`page-item ${nextLink.url === null ? 'disabled' : ''}`}>
                                        {nextLink.url ? (
                                            <Link
                                                className="page-link"
                                                href={nextLink.url}
                                                preserveScroll
                                                preserveState
                                            >
                                                &raquo;
                                            </Link>
                                        ) : (
                                            <span className="page-link">&raquo;</span>
                                        )}
                                    </li>
                                );

                                return items;
                            })()}
                        </ul>
                    </nav>
                </div>
            )}

        </div>
    );
}
