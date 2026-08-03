<?php

namespace Database\Seeders;

use App\Models\Citizen;
use App\Models\Notification;
use App\Models\Project;
use App\Models\ProjectUpdate;
use App\Models\Setting;
use App\Models\Subcounty;
use App\Models\Sublocation;
use App\Models\User;
use App\Models\Village;
use App\Models\Ward;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $tesoSouth = Subcounty::query()->firstOrCreate(['name' => 'Teso South']);
        $tesoNorth = Subcounty::query()->firstOrCreate(['name' => 'Teso North']);
        $matayos = Subcounty::query()->firstOrCreate(['name' => 'Matayos']);
        $funyula = Subcounty::query()->firstOrCreate(['name' => 'Funyula']);
        $butula = Subcounty::query()->firstOrCreate(['name' => 'Butula']);
        $budalangi = Subcounty::query()->firstOrCreate(['name' => 'Budalangi']);
        $nambale = Subcounty::query()->firstOrCreate(['name' => 'Nambale']);

        $market = Ward::query()->firstOrCreate(['name' => 'Amukura Central', 'subcounty_id' => $tesoSouth->id]);
        $railway = Ward::query()->firstOrCreate(['name' => 'Amukura East', 'subcounty_id' => $tesoSouth->id]);
        Ward::query()->firstOrCreate(['name' => 'Amukura West', 'subcounty_id' => $tesoSouth->id]);
        Ward::query()->firstOrCreate(['name' => 'Angorom', 'subcounty_id' => $tesoSouth->id]);
        Ward::query()->firstOrCreate(['name' => 'Chakol North', 'subcounty_id' => $tesoSouth->id]);
        Ward::query()->firstOrCreate(['name' => 'Chakol South', 'subcounty_id' => $tesoSouth->id]);
        $greenValley = Ward::query()->firstOrCreate(['name' => 'Angurai East', 'subcounty_id' => $tesoNorth->id]);
        Ward::query()->firstOrCreate(['name' => 'Angurai North', 'subcounty_id' => $tesoNorth->id]);
        Ward::query()->firstOrCreate(['name' => 'Angurai South', 'subcounty_id' => $tesoNorth->id]);
        Ward::query()->firstOrCreate(['name' => 'Malaba Central', 'subcounty_id' => $tesoNorth->id]);
        Ward::query()->firstOrCreate(['name' => 'Malaba North', 'subcounty_id' => $tesoNorth->id]);
        Ward::query()->firstOrCreate(['name' => 'Malaba South', 'subcounty_id' => $tesoNorth->id]);
        $hilltop = Ward::query()->firstOrCreate(['name' => 'Bukhayo West', 'subcounty_id' => $matayos->id]);
        Ward::query()->firstOrCreate(['name' => 'Burumba', 'subcounty_id' => $matayos->id]);
        Ward::query()->firstOrCreate(['name' => 'Busibwabo', 'subcounty_id' => $matayos->id]);
        Ward::query()->firstOrCreate(['name' => 'Matayos South', 'subcounty_id' => $matayos->id]);
        Ward::query()->firstOrCreate(['name' => 'Mayenje', 'subcounty_id' => $matayos->id]);
        $harbor = Ward::query()->firstOrCreate(['name' => "Agenga'", 'subcounty_id' => $funyula->id]);
        Ward::query()->firstOrCreate(['name' => 'Bwiri', 'subcounty_id' => $funyula->id]);
        Ward::query()->firstOrCreate(['name' => 'Namboboto Nambuku', 'subcounty_id' => $funyula->id]);
        Ward::query()->firstOrCreate(['name' => 'Nangina', 'subcounty_id' => $funyula->id]);
        Ward::query()->firstOrCreate(['name' => 'Bukhayo Central', 'subcounty_id' => $nambale->id]);
        Ward::query()->firstOrCreate(['name' => 'Bukhayo East', 'subcounty_id' => $nambale->id]);
        Ward::query()->firstOrCreate(['name' => 'Bukhayo North/Walatsi', 'subcounty_id' => $nambale->id]);
        Ward::query()->firstOrCreate(['name' => 'Nambale Township', 'subcounty_id' => $nambale->id]);
        Ward::query()->firstOrCreate(['name' => 'Bunyala Central', 'subcounty_id' => $budalangi->id]);
        Ward::query()->firstOrCreate(['name' => 'Bunyala North', 'subcounty_id' => $budalangi->id]);
        Ward::query()->firstOrCreate(['name' => 'Bunyala South', 'subcounty_id' => $budalangi->id]);
        Ward::query()->firstOrCreate(['name' => 'Bunyala West', 'subcounty_id' => $budalangi->id]);
        Ward::query()->firstOrCreate(['name' => 'Elugulu', 'subcounty_id' => $butula->id]);
        Ward::query()->firstOrCreate(['name' => 'Kingandole', 'subcounty_id' => $butula->id]);
        Ward::query()->firstOrCreate(['name' => 'Marachi Central', 'subcounty_id' => $butula->id]);
        Ward::query()->firstOrCreate(['name' => 'Marachi East', 'subcounty_id' => $butula->id]);
        Ward::query()->firstOrCreate(['name' => 'Marachi North', 'subcounty_id' => $butula->id]);
        Ward::query()->firstOrCreate(['name' => 'Marachi West', 'subcounty_id' => $butula->id]);

        $marketCentre = Sublocation::query()->firstOrCreate(['name' => 'Market Centre', 'ward_id' => $market->id]);
        $industrialLine = Sublocation::query()->firstOrCreate(['name' => 'Industrial Line', 'ward_id' => $railway->id]);
        $greenNorth = Sublocation::query()->firstOrCreate(['name' => 'Green Valley North', 'ward_id' => $greenValley->id]);
        Sublocation::query()->firstOrCreate(['name' => 'Hilltop Junction', 'ward_id' => $hilltop->id]);
        $harborLanding = Sublocation::query()->firstOrCreate(['name' => 'Harbor Landing', 'ward_id' => $harbor->id]);

        $mwangaza = Village::query()->firstOrCreate(['name' => 'Mwangaza Village', 'sublocation_id' => $marketCentre->id]);
        $umoja = Village::query()->firstOrCreate(['name' => 'Umoja Village', 'sublocation_id' => $marketCentre->id]);
        Village::query()->firstOrCreate(['name' => 'Kipepeo Village', 'sublocation_id' => $industrialLine->id]);
        $tumaini = Village::query()->firstOrCreate(['name' => 'Tumaini Village', 'sublocation_id' => $greenNorth->id]);
        $pwani = Village::query()->firstOrCreate(['name' => 'Pwani Village', 'sublocation_id' => $harborLanding->id]);

        Citizen::query()->firstOrCreate([
            'full_name' => 'Amina Wanjiku',
            'village_id' => $mwangaza->id,
        ], ['sex' => 'FEMALE', 'phone_number' => '+254712000111']);
        Citizen::query()->firstOrCreate([
            'full_name' => 'Brian Otieno',
            'village_id' => $umoja->id,
        ], ['sex' => 'MALE', 'phone_number' => '+254733000222']);
        Citizen::query()->firstOrCreate([
            'full_name' => 'Caroline Nekesa',
            'village_id' => $tumaini->id,
        ], ['sex' => 'FEMALE', 'phone_number' => '+254722000333']);
        Citizen::query()->firstOrCreate([
            'full_name' => 'David Kiptoo',
            'village_id' => $pwani->id,
        ], ['sex' => 'MALE', 'phone_number' => '+254701000444']);

        $water = Project::query()->firstOrCreate([
            'name' => 'Market Ward Water Extension',
            'ward_id' => $market->id,
        ], [
            'description' => 'Extend clean water access to Mwangaza and Umoja villages.',
            'status' => 'IN_PROGRESS',
            'priority' => 'HIGH',
            'start_date' => '2026-06-01',
            'due_date' => '2026-09-30',
            'progress' => 64,
            'budget' => 18500000,
            'actual_cost' => 11200000,
        ]);
        Project::query()->firstOrCreate([
            'name' => 'Green Valley ECDE Renovation',
            'ward_id' => $greenValley->id,
        ], [
            'description' => 'Renovate classrooms and sanitation facilities.',
            'status' => 'PLANNED',
            'priority' => 'MEDIUM',
            'start_date' => '2026-08-05',
            'due_date' => '2026-11-20',
            'progress' => 10,
            'budget' => 7200000,
            'actual_cost' => 500000,
        ]);
        $road = Project::query()->firstOrCreate([
            'name' => 'Harbor Access Road',
            'ward_id' => $harbor->id,
        ], [
            'description' => 'Grade and murram the feeder road into Harbor Landing.',
            'status' => 'ON_HOLD',
            'priority' => 'HIGH',
            'start_date' => '2026-05-12',
            'due_date' => '2026-08-30',
            'progress' => 38,
            'budget' => 26800000,
            'actual_cost' => 9300000,
        ]);
        $lights = Project::query()->firstOrCreate([
            'name' => 'Hilltop Solar Streetlights',
            'ward_id' => $hilltop->id,
        ], [
            'description' => 'Install public lighting around Hilltop Junction.',
            'status' => 'COMPLETED',
            'priority' => 'LOW',
            'start_date' => '2026-04-01',
            'due_date' => '2026-06-30',
            'completion_date' => '2026-06-22',
            'progress' => 100,
            'budget' => 4800000,
            'actual_cost' => 4550000,
        ]);

        ProjectUpdate::query()->firstOrCreate([
            'project_id' => $water->id,
            'title' => 'Main trenching complete',
        ], ['update_text' => 'Primary trenching is complete and pipe delivery is scheduled.', 'progress' => 64, 'status' => 'IN_PROGRESS']);
        ProjectUpdate::query()->firstOrCreate([
            'project_id' => $road->id,
            'title' => 'Awaiting drainage approval',
        ], ['update_text' => 'Work is paused pending drainage redesign approval.', 'progress' => 38, 'status' => 'ON_HOLD']);
        ProjectUpdate::query()->firstOrCreate([
            'project_id' => $lights->id,
            'title' => 'Commissioned',
        ], ['update_text' => 'Lights were tested and handed over to the ward office.', 'progress' => 100, 'status' => 'COMPLETED']);

        User::query()->updateOrCreate([
            'email' => 'admin@county.go.ke',
        ], [
            'name' => 'System Administrator',
            'password' => Hash::make('admin123'),
            'role' => 'System Administrator',
            'status' => 'Active',
            'last_active_at' => now(),
        ]);
        User::query()->updateOrCreate([
            'email' => 'governor@county.go.ke',
        ], [
            'name' => 'County Governor',
            'password' => Hash::make('governor123'),
            'role' => 'Governor',
            'status' => 'Active',
            'last_active_at' => now(),
        ]);
        User::query()->updateOrCreate([
            'email' => 'clerk@county.go.ke',
        ], [
            'name' => 'Clerk / Secretary',
            'password' => Hash::make('clerk123'),
            'role' => 'Clerk / Secretary',
            'status' => 'Active',
            'last_active_at' => now(),
        ]);

        foreach ([
            'county_name' => 'Smart County',
            'financial_year' => '2026/2027',
            'sms_alerts' => 'true',
            'email_reports' => 'true',
            'public_portal' => 'false',
        ] as $key => $value) {
            Setting::query()->updateOrCreate(['key' => $key], ['value' => $value]);
        }

        Notification::query()->firstOrCreate([
            'title' => 'Budget variance flagged',
        ], [
            'message' => 'Harbor Access Road has crossed 30% spend with less than 40% progress.',
            'type' => 'Finance',
        ]);
        Notification::query()->firstOrCreate([
            'title' => 'Project update submitted',
        ], [
            'message' => 'Market Ward Water Extension received a new field update.',
            'type' => 'Project',
        ]);
    }
}
