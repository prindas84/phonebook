import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function PhoneRecord({ phoneNumber = null, mode = 'create', flash = {} }) {
    
    const isCreate   = mode === 'create';
    const isExisting = !isCreate;

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFlash, setShowFlash] = useState(true);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
    } = useForm({
        first_name: phoneNumber?.first_name ?? '',
        surname:    phoneNumber?.surname ?? '',
        phone:      phoneNumber?.phone ?? '',
        address_1:  phoneNumber?.address_1 ?? '',
        address_2:  phoneNumber?.address_2 ?? '',
        city:       phoneNumber?.city ?? '',
        state:      phoneNumber?.state ?? '',
        postcode:   phoneNumber?.postcode ?? '',
    });

    // Auto-hide flash messages after 2 seconds
    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowFlash(true);

            const timer = setTimeout(() => {
                setShowFlash(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isCreate) {
            post(route('phone_numbers.store'));
        } else if (phoneNumber) {
            put(route('phone_numbers.update', phoneNumber.id));
        }
    };

    const confirmDelete = () => {
        if (!phoneNumber) return;

        destroy(route('phone_numbers.destroy', phoneNumber.id), {
            onSuccess: () => setShowDeleteModal(false),
        });
    };

    const pageTitle   = isCreate ? 'Add Record' : 'Edit Record';
    const headingText = isCreate ? 'New Record' : 'Edit Record';
    const submitLabel = isCreate ? 'Create New Record' : 'Save Changes';

    const commonInputProps = (field) => ({
        className: `form-control ${errors[field] ? 'is-invalid' : ''}`,
        value: data[field],
        onChange: (e) => setData(field, e.target.value),
        readOnly: false,
        disabled: processing,
    });

    return (
        <>
            <Head title={pageTitle} />

            <div className="container mt-4">

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1 className="mb-4">{headingText}</h1>

                    <Link href={route('phone_numbers.index')} className="btn btn-secondary mb-4">
                        Back to List
                    </Link>
                </div>

                {/* Flash Messages */}
                {showFlash && flash?.success && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        {flash.success}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowFlash(false)}
                        ></button>
                    </div>
                )}

                {showFlash && flash?.error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {flash.error}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowFlash(false)}
                        ></button>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* --- Row 1: First Name, Surname, Phone --- */}
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label className="form-label montserrat-heading">First Name</label>
                            <input type="text" {...commonInputProps('first_name')} />
                            {errors.first_name && (
                                <div className="invalid-feedback">{errors.first_name}</div>
                            )}
                        </div>

                        <div className="col-md-4 mb-3">
                            <label className="form-label montserrat-heading">Surname</label>
                            <input type="text" {...commonInputProps('surname')} />
                            {errors.surname && (
                                <div className="invalid-feedback">{errors.surname}</div>
                            )}
                        </div>

                        <div className="col-md-4 mb-3">
                            <label className="form-label montserrat-heading">Phone</label>
                            <input type="text" {...commonInputProps('phone')} />
                            {errors.phone && (
                                <div className="invalid-feedback">{errors.phone}</div>
                            )}
                        </div>
                    </div>

                    {/* --- Row 2: Address 1 --- */}
                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <label className="form-label montserrat-heading">Address 1</label>
                            <input type="text" {...commonInputProps('address_1')} />
                            {errors.address_1 && (
                                <div className="invalid-feedback">{errors.address_1}</div>
                            )}
                        </div>
                    </div>

                    {/* --- Row 3: Address 2 --- */}
                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <label className="form-label montserrat-heading">Address 2</label>
                            <input type="text" {...commonInputProps('address_2')} />
                            {errors.address_2 && (
                                <div className="invalid-feedback">{errors.address_2}</div>
                            )}
                        </div>
                    </div>

                    {/* --- Row 4: City, State, Postcode --- */}
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label className="form-label montserrat-heading">City</label>
                            <input type="text" {...commonInputProps('city')} />
                            {errors.city && (
                                <div className="invalid-feedback">{errors.city}</div>
                            )}
                        </div>

                        <div className="col-md-4 mb-3">
                            <label className="form-label montserrat-heading">State</label>
                            <input type="text" {...commonInputProps('state')} />
                            {errors.state && (
                                <div className="invalid-feedback">{errors.state}</div>
                            )}
                        </div>

                        <div className="col-md-4 mb-3">
                            <label className="form-label montserrat-heading">Postcode</label>
                            <input type="text" {...commonInputProps('postcode')} />
                            {errors.postcode && (
                                <div className="invalid-feedback">{errors.postcode}</div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary" disabled={processing}>
                            {submitLabel}
                        </button>

                        {isExisting && phoneNumber && (
                            <button
                                type="button"
                                className="btn btn-danger ms-auto"
                                onClick={() => setShowDeleteModal(true)}
                                disabled={processing}
                            >
                                Delete Record
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <>
                    <div
                        className="modal fade show"
                        tabIndex="-1"
                        role="dialog"
                        style={{ display: 'block' }}
                        aria-modal="true"
                    >
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title montserrat-heading">Confirm Delete</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowDeleteModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body montserrat-text">
                                    <p>Are you sure you want to delete this record? This cannot be undone.</p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowDeleteModal(false)}
                                        disabled={processing}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={confirmDelete}
                                        disabled={processing}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </>
    );
}
