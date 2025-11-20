<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PhoneNumbersSeeder extends Seeder
{
    public function run(): void
    {
        $firstNames = [
            'Olivia','Noah','Jack','Isla','Charlie','Mia','Lucas','Amelia','Leo','Evie',
            'Harper','Hudson','Zoe','Cooper','Ruby','Henry','Sophie','Archie','Chloe','Ethan',
            'Liam','Ella','Max','Grace','Oscar','Hannah','Mason','Ava','Billy','Lily',
        ];

        $surnames = [
            'Smith','Brown','Williams','Taylor','Wilson','Johnson','Anderson','Martin','Thompson','White',
            'Harris','Walker','Young','King','Wright','Scott','Green','Baker','Adams','Mitchell',
            'Edwards','Turner','Parker','Campbell','Reid','Murphy','Morris','Cooper','Hall','Cox',
        ];

        $suburbs = [
            'Brisbane City','Fortitude Valley','New Farm','West End','South Brisbane',
            'Kangaroo Point','Toowong','Indooroopilly','Chermside','Carindale',
            'Sunnybank','Wynnum','Red Hill','Paddington','Ashgrove',
        ];

        $records = [];

        for ($i = 1; $i <= 100; $i++) {
            // 0400000001 → 0400000100
            $phone = '04' . str_pad($i, 8, '0', STR_PAD_LEFT);

            $firstName = $firstNames[array_rand($firstNames)];
            $surname   = $surnames[array_rand($surnames)];
            $suburb    = $suburbs[array_rand($suburbs)];

            $streetNumber = rand(1, 200);
            $streets = [
                'Queen Street', 'George Street', 'Adelaide Street', 'Boundary Street',
                'Vulture Street', 'Given Terrace', 'Logan Road'
            ];

            $streetName = $streets[array_rand($streets)];

            $records[] = [
                'first_name' => $firstName,
                'surname'    => $surname,
                'phone'      => $phone,
                'address_1'  => $streetNumber . ' ' . $streetName,
                'address_2'  => '',
                'city'       => $suburb,
                'state'      => 'QLD',
                'postcode'   => (string) rand(4000, 4200),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('phone_numbers')->insert($records);
    }
}
