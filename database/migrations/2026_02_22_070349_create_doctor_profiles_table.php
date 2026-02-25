<?php
// filepath: c:\Users\HP\TABIBI\backend\database\migrations\2024_01_01_000002_create_doctor_profiles_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('doctor_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('specialty')->nullable();
            $table->text('bio')->nullable();
            $table->string('qualifications')->nullable();
            $table->decimal('consultation_fee', 8, 2)->nullable();
            $table->string('clinic_name')->nullable();
            $table->string('city')->nullable();
            $table->string('location')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doctor_profiles');
    }
};