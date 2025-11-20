<?php

namespace App\Http\Controllers;

use App\Models\PhoneNumber;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PhoneNumberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $sort      = $request->input('sort', 'name');
        $direction = $request->input('direction', 'asc');
        $search    = $request->input('search');

        $allowedSorts = ['name', 'phone', 'city', 'state', 'postcode'];
        if (!in_array($sort, $allowedSorts, true)) {
            $sort = 'name';
        }

        $query = PhoneNumber::query();

        // Search: name, phone, city, state, postcode
        if (!empty($search)) {
            $searchLike = '%' . $search . '%';

            $query->where(function ($q) use ($searchLike) {
                $q->where('first_name', 'like', $searchLike)
                    ->orWhere('surname', 'like', $searchLike)
                    // first + surname
                    ->orWhereRaw("CONCAT(first_name, ' ', surname) LIKE ?", [$searchLike])
                    // surname + first
                    ->orWhereRaw("CONCAT(surname, ' ', first_name) LIKE ?", [$searchLike])
                    // surname, first
                    ->orWhereRaw("CONCAT(surname, ', ', first_name) LIKE ?", [$searchLike])
                    // phone, city, state, postcode
                    ->orWhere('phone', 'like', $searchLike)
                    ->orWhere('city', 'like', $searchLike)
                    ->orWhere('state', 'like', $searchLike)
                    ->orWhere('postcode', 'like', $searchLike);
            });
        }

        // Sorting
        switch ($sort) {
            case 'phone':
                $query->orderBy('phone', $direction);
                break;

            case 'city':
                $query->orderBy('city', $direction);
                break;

            case 'state':
                $query->orderBy('state', $direction);
                break;

            case 'postcode':
                $query->orderBy('postcode', $direction);
                break;

            case 'name':
            default:
                $query->orderBy('surname', $direction)
                    ->orderBy('first_name', $direction);
                break;
        }

        $default_page_number = (int) config('phonebook.default_page_number', 20);

        $contacts = $query
            ->paginate($default_page_number)
            ->withQueryString();

        return Inertia::render('Home', [
            'contacts'  => $contacts,
            'sort'      => $sort,
            'direction' => $direction,
            'search'    => $search,
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('PhoneRecord');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'surname'    => ['required', 'string', 'max:255'],
            'phone'      => ['required', 'string', 'max:50', Rule::unique('phone_numbers', 'phone'),],
            'address_1'  => ['nullable', 'string', 'max:255'],
            'address_2'  => ['nullable', 'string', 'max:255'],
            'city'       => ['nullable', 'string', 'max:255'],
            'state'      => ['nullable', 'string', 'max:255'],
            'postcode'   => ['nullable', 'string', 'max:20'],
        ]);

        $phoneNumber = PhoneNumber::create($validated);

        return redirect()
            ->route('phone_numbers.show', $phoneNumber->id)
            ->with('success', 'Phone record created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(PhoneNumber $phoneNumber)
    {
        return Inertia::render('PhoneRecord', [
            'phoneNumber' => $phoneNumber,
            'mode'        => 'edit',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PhoneNumber $phoneNumber)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'surname'    => ['required', 'string', 'max:255'],
            'phone'      => ['required', 'string', 'max:50', Rule::unique('phone_numbers', 'phone')->ignore($phoneNumber->id),],
            'address_1'  => ['nullable', 'string', 'max:255'],
            'address_2'  => ['nullable', 'string', 'max:255'],
            'city'       => ['nullable', 'string', 'max:255'],
            'state'      => ['nullable', 'string', 'max:255'],
            'postcode'   => ['nullable', 'string', 'max:20'],
        ]);

        $phoneNumber->update($validated);

        return redirect()
            ->route('phone_numbers.show', $phoneNumber->id)
            ->with('success', 'Phone record updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PhoneNumber $phoneNumber)
    {
        $phoneNumber->delete();

        return redirect()
            ->route('phone_numbers.index')
            ->with('success', 'Record deleted successfully.');
    }

}
