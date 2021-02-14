const RequestUser = function(user) {
  this.user = user;
  this.relations = JSON.parse(this.user.user_relations);

  this.isManagerOf = function(id) {
    let users;
    switch (this.user.role) {
      case "rm":
        users = [
          ...this.relations.reps,
          ...this.relations.dm,
          ...this.relations.am
        ];
        return users.includes(id);
      case "am":
        users = [...this.relations.reps, ...this.relations.dm];
        return users.includes(id);
      case "admin" :
        return true;
      case "accountant":
        return true;
      default:
        return false;
    }
  };
};

export const CustomerRequest = function(request, user) {
  this.request = request;
  this.user = new RequestUser(user);
  this.isOwner = function() {
    return this.request.user.id === this.user.user.id;
  };

  this.canSubmit = function() {
    if (
      this.isOwner() &&
      !["approved", "confirmed"].includes(this.request.state)
    ) {
      return true;
    }
    return false;
  };

  this.canApprove = function() {
    if (
      this.user.isManagerOf(this.request.user.id)
    ) {
      return true;
    }
    return false;
  };

  this.canEdit = function() {
    if (
      (this.user.isManagerOf(this.request.user.id) || this.isOwner()) &&
      !["approved", "confirmed"].includes(this.request.state)
    ) {
      return true;
    }
    return false;
  };

  this.canDelete = function() {
    return (
      this.isOwner() && !["approved", "confirmed"].includes(this.request.state)
    );
  };
};
