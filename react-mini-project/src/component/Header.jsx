import { h } from 'preact'

export default function Header({ onNavigate }) {
  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-transparent py-3">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2" href="#" onClick={(e)=>{e.preventDefault(); onNavigate('home')}}>
          <i class="bi bi-stars fs-3 text-primary"></i>
          <span class="fw-bold">הכנות לשבת</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu" aria-controls="navMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navMenu">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li class="nav-item"><a class="nav-link" href="#" onClick={(e)=>{e.preventDefault(); onNavigate('home')}}>בית</a></li>
            <li class="nav-item"><a class="nav-link" href="#" onClick={(e)=>{e.preventDefault(); onNavigate('shopping')}}>קניות</a></li>
            <li class="nav-item"><a class="nav-link" href="#" onClick={(e)=>{e.preventDefault(); onNavigate('tasks')}}>משימות</a></li>
            <li class="nav-item"><a class="nav-link" href="#" onClick={(e)=>{e.preventDefault(); onNavigate('cooking')}}>בישולים</a></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
