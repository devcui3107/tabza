function Tabza(s, o) {
  const dO = {
    activeTab: null,
    activeClass: null,
    useLS: true,
    action: () => {},
  };

  this.opt = Object.assign({}, dO, o);
  this.i = null;

  if (s) {
    this.init(s);
  } else {
    console.error("Tabza Error: Invalid selector.");
  }
}

Tabza.prototype.init = function (s) {
  const c = document.querySelector(s);
  if (!c) {
    console.error("Tabza Error: Invalid container.");
    return;
  }
  this.c = [...c.children];

  if (this.c.length < 2) {
    console.error("Tabza Error: At least 2 child elements required.");
    return;
  }

  const [l, p] = this.c;

  if (l && p) {
    if (l.children.length !== p.children.length) {
      console.error("Tabza Error: Tab items and panels must match.");
      return;
    }

    this.t = [...l.children];
    this.p = [...p.children];

    l.addEventListener("click", (e) => {
      const t = e.target.closest("button, a, [data-tab]");
      if (t) {
        const i = this.t.indexOf(t);
        this._a(i);
        if (this.opt.useLS) this._sLS(i);
      }
    });
  }

  let a = 0;
  if (this.opt.useLS) {
    const i = this._gLS();
    a = i !== null ? i : this.opt.activeTab ?? 0;
  } else {
    a = this.opt.activeTab ?? 0;
  }

  this._a(a);
};

Tabza.prototype._kLS = function () {
  return `Tabza-${this.c[0].parentNode.id || this.c[0].parentNode.className}`;
};

Tabza.prototype._gLS = function () {
  const k = this._kLS();
  const i = localStorage.getItem(k);
  return i !== null ? +i : null;
};

Tabza.prototype._sLS = function (i) {
  const k = this._kLS();
  localStorage.setItem(k, i);
};

Tabza.prototype._hT = function () {
  this.p.forEach((p) => {
    p.hidden = true;
  });
};

Tabza.prototype._sP = function (i) {
  if (this.p[i]) {
    this.p[i].hidden = false;
  }
};

Tabza.prototype._a = function (i) {
  const pI = this.i;
  const nI = i;

  if (typeof this.opt.action === "function") {
    this.opt.action(
      pI,
      nI,
      this.t[pI] || null,
      this.t[nI],
      this.p[pI] || null,
      this.p[nI],
      this.c
    );
  }

  this.i = nI;

  const [l, p] = this.c;
  if (l && p) {
    this.t.forEach((t) => {
      t.classList.remove(this.opt.activeClass);
    });

    this._hT();

    this.t[i].classList.add(this.opt.activeClass);
    this._sP(i);
  }
};
