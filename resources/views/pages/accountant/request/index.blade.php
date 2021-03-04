@extends('layouts.acc')

@section('style')
<style>
  td,
  tr {
    white-space: nowrap;
  }

  .dt-buttons .btn {
    background-color: #34343e;
  }
</style>
@endsection

@section('content')
<div class="px-0 shadow rounded pb-5 bg-white" style="min-height:550px;">
  <p class="alert alert-success">
    <span class="fa fa-book-reader"></span>
    <span class="font-weight-bold">Requests List</span>
  </p>
  <div class="p-2">
    <div class="p-2 border my-2 rounded">
      <div class="form-inline">
        <label for="" class="mx-2 text-muted">Show</label>
        <div class="form-group small">
          <input type="checkbox" value="pending" class="mx-1 show-mode-toggler"
            {{ $type==='pending' ? 'checked' : '' }}> <label for="">Pending</label>
          <input type="checkbox" value="all" class="mx-1 show-mode-toggler" {{ $type==='all' ? 'checked' : '' }}> <label
            for="">All</label>
          <input type="checkbox" value="created" class="mx-1 show-mode-toggler"
            {{ $type==='created' ? 'checked' : '' }}> <label for="">Created</label>
          <input type="checkbox" value="canceled" class="mx-1 show-mode-toggler"
            {{ $type==='canceled' ? 'checked' : '' }}> <label for="">Canceled</label>
          <input type="checkbox" value="changed" class="mx-1 show-mode-toggler"
            {{ $type==='changed' ? 'checked' : '' }}> <label for="">Changed</label>
          <input type="checkbox" value="confirmed" class="mx-1 show-mode-toggler"
            {{ $type==='confirmed' ? 'checked' : '' }}> <label for="">Confirmed</label>
          <input type="checkbox" value="approved" class="mx-1 show-mode-toggler"
            {{ $type==='approved' ? 'checked' : '' }}> <label for="">Approved</label>
        </div>
      </div>
    </div>
    @if (count($requests))
    <table class="table table-sm table-responsive small table-striped" id="requests_table">
      <thead class="bg-success text-light">
        <tr>
          <th>ID</th>
          <th>Actions</th>
          <th>Status</th>
          <th>Request</th>
          <th>Serial</th>
          <th>Query Date</th>
          <th>Apply Date</th>
          <th>Product</th>
          <th>Cost</th>
          <th>Quantity</th>
          <th>Total Cost</th>
          <th>Item</th>
          <th>Description</th>
          <th>Others</th>
          <th>Requested By</th>
          <th>Origin</th>
          <th>Role</th>
          <th>Line</th>
          <th>Customer</th>
          <th>Specialty</th>
          <th>Parameter</th>
          <th>Rx per month</th>
          <th>Durations</th>
          <th>Total Rx</th>
          <th>Brick</th>
          <th>Area</th>
          <th>District</th>
          <th>Territory</th>
          <th>Pharmacy 1</th>
          <th>Pharmacy 2</th>
          <th>Pharmacy 3</th>
          <th>Pharmacy 4</th>
          <th>Area Manager Approval</th>
          <th>Business Unit Approval</th>
        </tr>
      </thead>
      <tbody>
        @foreach($requests as $item)
        <tr>
          <td>{{ $item->id }}</td>
          <td class="btn-group btn-sm" role="group"><button class="btn btn-primary btn-sm"><span
                class="fa fa-book-reader"></span></button><button class="btn btn-primary btn-sm"><span
                class="fa fa-edit"></span></button></td>
          <td>{{ $item->state }}</td>
          <td>{{ $item->type }}</td>
          <td>{{ $item->serial }}</td>
          <td>{{ $item->query_date }}</td>
          <td>{{ $item->apply_date }}</td>
          <td>{{ $item->product }}</td>
          <td>{{ $item->cost / $item->quantity }}</td>
          <td>{{ $item->quantity }}</td>
          <td>{{ $item->cost }}</td>
          <td>{{ json_decode($item->comment)->item }}</td>
          <td>{{ json_decode($item->comment)->desc }}</td>
          <td>{{ $item->others}}</td>
          <td>{{ $item->user->name }}</td>
          <td>{{ $item->origin_type }}</td>
          <td>{{ $item->user->role}}</td>
          <td>{{ implode(' | ',json_decode($item->user->line)) }}</td>
          <td>{{ $item->customer->name }}</td>
          <td>{{ $item->customer->specialty}}</td>
          <td>{{ count($item->customer->params) ? $item->customer->params[0]->current : 'NN'  }}</td>
          <td>{{ $item->rx }}</td>
          <td>{{ $item->rx_months }}</td>
          <td>{{ $item->rx * $item->rx_months }}</td>
          <td>{{ $item->customer->brick }}</td>
          <td>{{ $item->customer->area }}</td>
          <td>{{ $item->customer->district }}</td>
          <td>{{ $item->customer->territory }}</td>
          <td>{{ $item->pharmacy_1 ? $item->pharmacy_1->name : '---------' }}</td>
          <td>{{ $item->pharmacy_2 ? $item->pharmacy_2->name : '---------' }}</td>
          <td>{{ $item->pharmacy_3 ? $item->pharmacy_3->name : '---------' }}</td>
          <td>{{ $item->pharmacy_4 ? $item->pharmacy_4->name : '---------' }}</td>
          <td>{{ $item->am_approval? 'YES': 'NO' }}</td>
          <td>{{ $item->rm_approval? 'YES': 'NO' }}</td>
        </tr>
        @endforeach
      </tbody>
    </table>
    @else
    <div class="pt-4 text-center">
      <p>
        <span><i class="fa fa-check-circle text-success fa-6x"></i></span>
      </p>
      <p class="text-muted">No Requests found</p>
    </div>
    @endif
  </div>
</div>
@endsection


@section('script')
<script>
  $(document).ready(function() {
      $('#requests_table').dataTable({
        lengthMenu: [20, 50, 100],
        dom: "Bflitp",
        select: {
          style: 'single'
        },
        buttons: [
          {
            extend: 'excel',
            text: `<i class="fa fa-file-excel"></i> Export to Excel`,
            filename: `Request_list_with_{{ $type }}_type`,
          }
        ],
        language: {
          searchPlaceholder: 'Search requests'
        }
      });

      var showModeTogglers = $('.show-mode-toggler');
      showModeTogglers.each(function(index, item) {
        if(!item.checked) {
          $(item).click(function() {
            let url = `{{ url("accountant/requests") }}?type=${item.value}`;
            window.location.replace(url)
          });
        }
      })
    })
</script>
@endsection
