<?php
// filepath: c:\Users\HP\TABIBI\backend\database\migrations\2024_01_01_000005_create_appointments_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            $table->foreignId('patient_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            $table->date('appointment_date');
            $table->time('appointment_time');
            $table->enum('status', ['pending', 'accepted', 'cancelled', 'completed'])
                  ->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};