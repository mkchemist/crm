<template>
  <div>
    <div class="p-2">
      <h2 class="text-muted">Customer Info.</h2>
      <hr>
      <div class="row mx-auto">
        <div class="col-lg">
          <p class="mb-1 border-bottom">Name: <span class="font-weight-bold text-primary mx-2">{{ $attrs.data.name }}</span></p>
          <p class="mb-1 border-bottom">
            Specialty: <span class="font-weight-bold text-primary mx-2">{{ $attrs.data.specialty }}</span>
          </p>
          <p class="mb-1 border-bottom">Title : <span class="font-weight-bold text-primary mx-2">{{ $attrs.data.title }}</span></p>
          <p class="mb-1 border-bottom">
            Frequency :
            <span class="font-weight-bold text-primary mx-2">{{ $attrs.data.frequency.length ? $attrs.data.frequency[0].current : 0 }}</span>
          </p>
          <p class="mb-1 border-bottom">
            Parameter:
            <span class="font-weight-bold text-primary mx-2">{{ $attrs.data.params.length ? $attrs.data.params[0].current : 0 }}</span>
          </p>
          <p class="mb-1 border-bottom">
            Plans: <span class="font-weight-bold text-primary mx-2">{{ $attrs.data.planner.length }}</span>
          </p>
          <p class="mb-1 border-bottom">
            Reports: <span class="font-weight-bold text-primary mx-2">{{ $attrs.data.report.length }}</span>
          </p>
        </div>
        <div class="col-lg">
          <p class="mb-1 border-bottom">Address: <span class="font-weight-bold text-primary mx-2">{{ $attrs.data.address }}</span></p>
          <p class="mb-1 border-bottom">Brick: <span class="font-weight-bold text-primary mx-2">{{ $attrs.data.brick }}</span></p>
          <p class="mb-1 border-bottom">Area: <span class="font-weight-bold text-primary mx-2">{{ $attrs.data.area }}</span></p>
          <p class="mb-1 border-bottom">District: <span class="font-weight-bold text-primary mx-2">{{ $attrs.data.district }}</span></p>
          <p class="mb-1 border-bottom">Territory: <span class="font-weight-bold text-primary mx-2">{{ $attrs.data.territory }}</span></p>
          <p class="mb-1 border-bottom">Region: <span class="font-weight-bold text-primary mx-2">{{ $attrs.data.region }}</span></p>


        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
