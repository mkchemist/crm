<template>
  <div>
    <div class="my-2 px-0  rounded shadow-sm">
      <p class="bg-primary text-light p-2 mb-0 lead">Pharmacy Info.</p>
      <div class="p-2 row mx-auto small">
        <div class="col-lg">
          <p class="mb-0 border-bottom">
            Pharmacy Name :
            <span class="font-weight-bold text-primary">{{
              $attrs.pharmacy.name
            }}</span>
          </p>
          <p class="mb-0 border-bottom">
            Pharmacy Type :
            <span class="font-weight-bold text-primary">{{
              $attrs.pharmacy.type
            }}</span>
          </p>
          <p class="mb-0 border-bottom">
            Key Person :
            <span class="font-weight-bold text-primary">{{
              $attrs.pharmacy.key_person || "--------"
            }}</span>
          </p>
          <p class="mb-0 border-bottom">
            No. of visits :
            <span class="font-weight-bold text-primary">{{
              $attrs.pharmacy.reports
            }}</span>
          </p>
        </div>
        <div class="col-lg">
          <p class="mb-0 border-bottom">
            Address :
            <span class="font-weight-bold text-primary">{{
              $attrs.pharmacy.address
            }}</span>
          </p>
          <p class="mb-0 border-bottom">
            Brick:
            <span class="font-weight-bold text-primary">{{
              $attrs.pharmacy.brick
            }}</span>
          </p>
          <p class="mb-0 border-bottom">
            Area :
            <span class="font-weight-bold text-primary">{{
              $attrs.pharmacy.area
            }}</span>
          </p>
          <p class="mb-0 border-bottom">
            District :
            <span class="font-weight-bold text-primary">{{
              $attrs.pharmacy.district
            }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
