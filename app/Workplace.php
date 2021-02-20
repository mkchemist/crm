<?php

namespace App;

use App\Helpers\Setting\ActiveCycleSetting;
use App\Helpers\Traits\CustomData;
use Illuminate\Database\Eloquent\Model;

class Workplace extends Model
{
    use CustomData;

    protected $fillable = [
        'name',
        'type',
        'address',
        'brick',
        'area',
        'district',
        'territory',
        'region',
        'phone',
        'state',
        'approved',
        'approved_by',
        "added_by",
    ];

    public function departs()
    {
        return $this->hasMany('App\WorkplaceDepartment', 'workplace_id', 'id');
    }

    public function reports()
    {
        $model = $this->hasMany('App\WorkplaceReport')->orderBy('visit_date');
        $activeCycle = new ActiveCycleSetting;
        $data = $activeCycle->all();
        return $this->getRelatedUserData($model, 'visit_date', [$data->start, $data->end]);
    }

    public function plans()
    {
        $model = $this->hasMany('App\WorkplacePlanner')->orderBy('plan_date');
        return $this->getRelatedUserData($model);
    }

    public function added_by()
    {
        return $this->belongsTo('App\User', 'added_by', 'id');
    }
}
