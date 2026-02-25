<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\DoctorProfile;
use App\Models\PatientProfile;
use App\Models\Specialty;
use App\Models\Availability;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        // ─── Specialties ─────────────────────────────────────
        $specialties = [
            'Cardiology', 'Dermatology', 'Neurology',
            'Ophthalmology', 'Dentistry', 'Pediatrics',
            'Orthopedics', 'General Medicine', 'Gynecology', 'Psychiatry',
        ];

        foreach ($specialties as $name) {
            Specialty::firstOrCreate(['name' => $name]);
        }

        // ─── Admin ───────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'admin@tabibi.com'],
            [
                'name'     => 'Admin TABIBI',
                'password' => Hash::make('password'),
                'role'     => 'admin',
                'cin'      => 'AD000000',
            ]
        );

        // ─── Doctors ─────────────────────────────────────────
        $doctors = [
            [
                'name'  => 'Youssef Benali',
                'email' => 'youssef.benali@tabibi.com',
                'phone' => '+212 6 1111 1111',
                'cin'   => 'BE111111',
                'profile' => [
                    'specialty'        => 'Cardiology',
                    'bio'              => 'Experienced cardiologist with over 10 years in heart disease treatment.',
                    'qualifications'   => 'MD, FACC',
                    'consultation_fee' => 300,
                    'clinic_name'      => 'Clinique du Coeur',
                    'city'             => 'Rabat',
                    'location'         => '12 Avenue Mohammed V, Rabat',
                    'status'           => 'approved',
                ],
                // Mon, Wed, Fri
                'availability' => [
                    ['day_of_week' => 1, 'start_time' => '09:00', 'end_time' => '13:00'],
                    ['day_of_week' => 3, 'start_time' => '09:00', 'end_time' => '13:00'],
                    ['day_of_week' => 5, 'start_time' => '14:00', 'end_time' => '18:00'],
                ],
            ],
            [
                'name'  => 'Fatima Zahra Idrissi',
                'email' => 'fatima.idrissi@tabibi.com',
                'phone' => '+212 6 2222 2222',
                'cin'   => 'ID222222',
                'profile' => [
                    'specialty'        => 'Dermatology',
                    'bio'              => 'Specialist in skin conditions and cosmetic dermatology.',
                    'qualifications'   => 'MD, Board Certified Dermatologist',
                    'consultation_fee' => 250,
                    'clinic_name'      => 'Skin Care Center',
                    'city'             => 'Casablanca',
                    'location'         => '45 Rue Hassan II, Casablanca',
                    'status'           => 'approved',
                ],
                // Tue, Thu, Sat
                'availability' => [
                    ['day_of_week' => 2, 'start_time' => '10:00', 'end_time' => '14:00'],
                    ['day_of_week' => 4, 'start_time' => '10:00', 'end_time' => '14:00'],
                    ['day_of_week' => 6, 'start_time' => '09:00', 'end_time' => '12:00'],
                ],
            ],
            [
                'name'  => 'Karim Mansouri',
                'email' => 'karim.mansouri@tabibi.com',
                'phone' => '+212 6 3333 3333',
                'cin'   => 'MA333333',
                'profile' => [
                    'specialty'        => 'Neurology',
                    'bio'              => 'Neurologist specializing in epilepsy and stroke management.',
                    'qualifications'   => 'MD, PhD Neuroscience',
                    'consultation_fee' => 350,
                    'clinic_name'      => 'Neuro Plus Clinic',
                    'city'             => 'Fès',
                    'location'         => '7 Boulevard Allal El Fassi, Fès',
                    'status'           => 'approved',
                ],
                // Mon, Tue, Wed
                'availability' => [
                    ['day_of_week' => 1, 'start_time' => '08:00', 'end_time' => '12:00'],
                    ['day_of_week' => 2, 'start_time' => '08:00', 'end_time' => '12:00'],
                    ['day_of_week' => 3, 'start_time' => '14:00', 'end_time' => '18:00'],
                ],
            ],
            [
                'name'  => 'Nadia Cherkaoui',
                'email' => 'nadia.cherkaoui@tabibi.com',
                'phone' => '+212 6 4444 4444',
                'cin'   => 'CH444444',
                'profile' => [
                    'specialty'        => 'Ophthalmology',
                    'bio'              => 'Expert in eye care, laser surgery, and retinal diseases.',
                    'qualifications'   => 'MD, FRCS Ophthalmology',
                    'consultation_fee' => 200,
                    'clinic_name'      => 'Vision Clinic',
                    'city'             => 'Marrakech',
                    'location'         => '3 Rue Ibn Sina, Marrakech',
                    'status'           => 'approved',
                ],
                // Mon, Wed, Thu
                'availability' => [
                    ['day_of_week' => 1, 'start_time' => '09:00', 'end_time' => '12:00'],
                    ['day_of_week' => 3, 'start_time' => '09:00', 'end_time' => '12:00'],
                    ['day_of_week' => 4, 'start_time' => '14:00', 'end_time' => '17:00'],
                ],
            ],
            [
                'name'  => 'Omar Tahiri',
                'email' => 'omar.tahiri@tabibi.com',
                'phone' => '+212 6 5555 5555',
                'cin'   => 'TA555555',
                'profile' => [
                    'specialty'        => 'Dentistry',
                    'bio'              => 'General dentist with expertise in cosmetic and restorative dentistry.',
                    'qualifications'   => 'DDS, Cosmetic Dentistry Certified',
                    'consultation_fee' => 150,
                    'clinic_name'      => 'Smile Dental Center',
                    'city'             => 'Salé',
                    'location'         => '22 Avenue Imam Malik, Salé',
                    'status'           => 'approved',
                ],
                // Tue, Thu, Sat
                'availability' => [
                    ['day_of_week' => 2, 'start_time' => '09:00', 'end_time' => '13:00'],
                    ['day_of_week' => 4, 'start_time' => '09:00', 'end_time' => '13:00'],
                    ['day_of_week' => 6, 'start_time' => '10:00', 'end_time' => '13:00'],
                ],
            ],
            [
                'name'  => 'Samira Benhaddou',
                'email' => 'samira.benhaddou@tabibi.com',
                'phone' => '+212 6 6666 6666',
                'cin'   => 'BH666666',
                'profile' => [
                    'specialty'        => 'Pediatrics',
                    'bio'              => 'Dedicated pediatrician with 8 years of experience caring for children.',
                    'qualifications'   => 'MD, Pediatrics Board Certified',
                    'consultation_fee' => 180,
                    'clinic_name'      => 'Kids Care Clinic',
                    'city'             => 'Agadir',
                    'location'         => '10 Rue du Souss, Agadir',
                    'status'           => 'approved',
                ],
                // Mon to Thu
                'availability' => [
                    ['day_of_week' => 1, 'start_time' => '08:30', 'end_time' => '12:30'],
                    ['day_of_week' => 2, 'start_time' => '08:30', 'end_time' => '12:30'],
                    ['day_of_week' => 3, 'start_time' => '14:00', 'end_time' => '17:00'],
                    ['day_of_week' => 4, 'start_time' => '14:00', 'end_time' => '17:00'],
                ],
            ],
            [
                'name'  => 'Hassan Ziani',
                'email' => 'hassan.ziani@tabibi.com',
                'phone' => '+212 6 7777 7777',
                'cin'   => 'ZI777777',
                'profile' => [
                    'specialty'        => 'Orthopedics',
                    'bio'              => 'Orthopedic surgeon specializing in joint replacement and sports injuries.',
                    'qualifications'   => 'MD, FRCS Orthopedics',
                    'consultation_fee' => 400,
                    'clinic_name'      => 'OrthoSport Clinic',
                    'city'             => 'Tanger',
                    'location'         => '5 Avenue Mohammed VI, Tanger',
                    'status'           => 'approved',
                ],
                // Wed, Fri
                'availability' => [
                    ['day_of_week' => 3, 'start_time' => '10:00', 'end_time' => '14:00'],
                    ['day_of_week' => 5, 'start_time' => '10:00', 'end_time' => '14:00'],
                ],
            ],
            [
                'name'  => 'Leila Amrani',
                'email' => 'leila.amrani@tabibi.com',
                'phone' => '+212 6 8888 8888',
                'cin'   => 'AM888888',
                'profile' => [
                    'specialty'        => 'General Medicine',
                    'bio'              => 'General practitioner providing comprehensive primary healthcare.',
                    'qualifications'   => 'MD, General Medicine',
                    'consultation_fee' => 100,
                    'clinic_name'      => 'Al Shifa Medical Center',
                    'city'             => 'Meknès',
                    'location'         => '18 Rue Zitoune, Meknès',
                    'status'           => 'approved',
                ],
                // Mon to Fri
                'availability' => [
                    ['day_of_week' => 1, 'start_time' => '08:00', 'end_time' => '12:00'],
                    ['day_of_week' => 2, 'start_time' => '08:00', 'end_time' => '12:00'],
                    ['day_of_week' => 3, 'start_time' => '08:00', 'end_time' => '12:00'],
                    ['day_of_week' => 4, 'start_time' => '14:00', 'end_time' => '18:00'],
                    ['day_of_week' => 5, 'start_time' => '14:00', 'end_time' => '18:00'],
                ],
            ],
            [
                'name'  => 'Rachid Oulad',
                'email' => 'rachid.oulad@tabibi.com',
                'phone' => '+212 6 9999 9999',
                'cin'   => 'OU999999',
                'profile' => [
                    'specialty'        => 'Gynecology',
                    'bio'              => 'Gynecologist with expertise in women\'s health and obstetrics.',
                    'qualifications'   => 'MD, OB/GYN Board Certified',
                    'consultation_fee' => 280,
                    'clinic_name'      => 'Women\'s Health Clinic',
                    'city'             => 'Oujda',
                    'location'         => '30 Boulevard Al Massira, Oujda',
                    'status'           => 'pending',
                ],
                // Tue, Thu
                'availability' => [
                    ['day_of_week' => 2, 'start_time' => '09:00', 'end_time' => '13:00'],
                    ['day_of_week' => 4, 'start_time' => '09:00', 'end_time' => '13:00'],
                ],
            ],
            [
                'name'  => 'Zineb Kabbaj',
                'email' => 'zineb.kabbaj@tabibi.com',
                'phone' => '+212 6 1010 1010',
                'cin'   => 'KA101010',
                'profile' => [
                    'specialty'        => 'Psychiatry',
                    'bio'              => 'Psychiatrist specializing in anxiety, depression, and mental wellness.',
                    'qualifications'   => 'MD, Psychiatry Board Certified',
                    'consultation_fee' => 320,
                    'clinic_name'      => 'Mind & Soul Clinic',
                    'city'             => 'Rabat',
                    'location'         => '8 Rue Patrice Lumumba, Rabat',
                    'status'           => 'pending',
                ],
                // Mon, Wed, Fri
                'availability' => [
                    ['day_of_week' => 1, 'start_time' => '10:00', 'end_time' => '14:00'],
                    ['day_of_week' => 3, 'start_time' => '10:00', 'end_time' => '14:00'],
                    ['day_of_week' => 5, 'start_time' => '10:00', 'end_time' => '14:00'],
                ],
            ],
        ];

        foreach ($doctors as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name'     => $data['name'],
                    'password' => Hash::make('password'),
                    'role'     => 'doctor',
                    'phone'    => $data['phone'],
                    'cin'      => $data['cin'],
                ]
            );

            DoctorProfile::firstOrCreate(
                ['user_id' => $user->id],
                $data['profile']
            );

            // ✅ Add availability slots
            foreach ($data['availability'] as $slot) {
                Availability::firstOrCreate(
                    [
                        'doctor_id'   => $user->id,
                        'day_of_week' => $slot['day_of_week'],
                    ],
                    [
                        'start_time' => $slot['start_time'],
                        'end_time'   => $slot['end_time'],
                    ]
                );
            }
        }

        // ─── Patients ─────────────────────────────────────────
        $patients = [
            ['name' => 'Ahmed Boulahia',  'email' => 'ahmed.boulahia@gmail.com',  'phone' => '+212 6 1122 3344', 'cin' => 'PA100001', 'profile' => ['date_of_birth' => '1990-05-15', 'medical_notes' => 'Allergic to penicillin.']],
            ['name' => 'Salma Tazi',       'email' => 'salma.tazi@gmail.com',       'phone' => '+212 6 2233 4455', 'cin' => 'PA100002', 'profile' => ['date_of_birth' => '1995-08-22', 'medical_notes' => 'Diabetic type 2.']],
            ['name' => 'Mohammed Filali',  'email' => 'mohammed.filali@gmail.com',  'phone' => '+212 6 3344 5566', 'cin' => 'PA100003', 'profile' => ['date_of_birth' => '1988-03-10', 'medical_notes' => 'Hypertension, takes daily medication.']],
            ['name' => 'Houda Najib',      'email' => 'houda.najib@gmail.com',      'phone' => '+212 6 4455 6677', 'cin' => 'PA100004', 'profile' => ['date_of_birth' => '2000-11-30', 'medical_notes' => 'No known allergies.']],
            ['name' => 'Yassine Berrada',  'email' => 'yassine.berrada@gmail.com',  'phone' => '+212 6 5566 7788', 'cin' => 'PA100005', 'profile' => ['date_of_birth' => '1993-07-04', 'medical_notes' => 'Asthma, uses inhaler.']],
            ['name' => 'Kawtar Sabir',     'email' => 'kawtar.sabir@gmail.com',     'phone' => '+212 6 6677 8899', 'cin' => 'PA100006', 'profile' => ['date_of_birth' => '1997-01-18', 'medical_notes' => 'No known conditions.']],
            ['name' => 'Hamza Lahlou',     'email' => 'hamza.lahlou@gmail.com',     'phone' => '+212 6 7788 9900', 'cin' => 'PA100007', 'profile' => ['date_of_birth' => '1985-09-25', 'medical_notes' => 'Previous knee surgery in 2019.']],
            ['name' => 'Meriem Azzouzi',   'email' => 'meriem.azzouzi@gmail.com',   'phone' => '+212 6 8899 0011', 'cin' => 'PA100008', 'profile' => ['date_of_birth' => '1992-04-12', 'medical_notes' => 'Allergic to aspirin.']],
            ['name' => 'Tariq Bouazza',    'email' => 'tariq.bouazza@gmail.com',    'phone' => '+212 6 9900 1122', 'cin' => 'PA100009', 'profile' => ['date_of_birth' => '1999-12-05', 'medical_notes' => 'No known allergies.']],
            ['name' => 'Imane Senhaji',    'email' => 'imane.senhaji@gmail.com',    'phone' => '+212 6 0011 2233', 'cin' => 'PA100010', 'profile' => ['date_of_birth' => '1996-06-20', 'medical_notes' => 'Anxiety disorder, under treatment.']],
        ];

        foreach ($patients as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name'     => $data['name'],
                    'password' => Hash::make('password'),
                    'role'     => 'patient',
                    'phone'    => $data['phone'],
                    'cin'      => $data['cin'],
                ]
            );

            PatientProfile::firstOrCreate(
                ['user_id' => $user->id],
                $data['profile']
            );
        }

        $this->command->info('✅ Test data seeded successfully!');
        $this->command->info('─────────────────────────────────────────');
        $this->command->info('👤 Admin:    admin@tabibi.com   / password');
        $this->command->info('🩺 Doctors:  [name]@tabibi.com  / password');
        $this->command->info('🧑 Patients: [name]@gmail.com   / password');
    }
}